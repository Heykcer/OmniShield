import re
import socket
import pandas as pd
from urllib.parse import urlparse
import tldextract

TOP_LEGIT_DOMAINS = {
    'google.com', 'github.com', 'microsoft.com', 'apple.com', 'paypal.com',
    'amazon.com', 'facebook.com', 'twitter.com', 'x.com', 'linkedin.com',
    'netflix.com', 'youtube.com', 'wikipedia.org', 'instagram.com', 'yahoo.com',
    'nytimes.com', 'stackoverflow.com', 'python.org', 'reddit.com', 'cnn.com',
    'medium.com', 'cloudflare.com', 'gitlab.com', 'docker.com', 'openai.com',
    'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'walmart.com', 'ebay.com'
}

SUSPICIOUS_KEYWORDS = {
    'login', 'signin', 'verify', 'verification', 'security', 'secure',
    'account', 'update', 'banking', 'wallet', 'support', 'auth', 'recover',
    'confirm', 'service', 'client', 'portal', 'access', 'device-locked',
    'suspended', 'password', 'billing', 'credential', 'validate'
}

BRAND_KEYWORDS = {
    'paypal', 'apple', 'microsoft', 'google', 'amazon', 'netflix', 'chase',
    'bankofamerica', 'wellsfargo', 'facebook', 'instagram', 'github', 'binance',
    'coinbase', 'walmart', 'ebay', 'steam', 'roblox'
}

SHORTENER_DOMAINS = {
    'bit.ly', 'goo.gl', 't.co', 'tinyurl.com', 'tiny.cc', 'ow.ly', 'is.gd',
    'buff.ly', 'adf.ly', 'bitly.com', 'cutt.ly', 'rb.gy', 'shorturl.at'
}

def contains_brand_token(text: str, brand: str) -> bool:
    pattern = rf'(?:^|[\.\-_0-9]){re.escape(brand)}(?:$|[\.\-_0-9])'
    return bool(re.search(pattern, text))

def extract_uci_features(url: str) -> pd.DataFrame:
    """
    Extracts the 30 specific features required by the UCI Phishing Dataset format.
    Returns a Pandas DataFrame that can be fed directly into the trained ML models.
    Values are: 1 (Legitimate/Safe), 0 (Suspicious), -1 (Phishing)
    """
    if not url.startswith('http'):
        url = 'http://' + url
        
    parsed = urlparse(url)
    ext = tldextract.extract(url)
    root_domain = f"{ext.domain}.{ext.suffix}".lower() if ext.suffix else ext.domain.lower()
    domain = ext.domain.lower()
    subdomain = ext.subdomain.lower()
    full_host = parsed.netloc.lower()
    path_and_query = f"{parsed.path}?{parsed.query}".lower()
    
    # 1. Known top authority domain check
    is_trusted = root_domain in TOP_LEGIT_DOMAINS
    
    # 2. Brand impersonation / spoofing detection
    impersonated_brands = [
        b for b in BRAND_KEYWORDS 
        if contains_brand_token(full_host, b) and not root_domain.startswith(f"{b}.")
    ]
    is_brand_spoof = len(impersonated_brands) > 0
    
    # 3. Suspicious credential harvesting keywords
    has_suspicious_words = any(w in full_host or w in path_and_query for w in SUSPICIOUS_KEYWORDS)
    
    features = {}
    
    # 1. having_IP_Address: if domain is IP address
    features['having_IP_Address'] = -1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', domain) else 1
    
    # 2. URL_Length: <54 safe, 54-75 suspicious, >75 phishing
    features['URL_Length'] = 1 if len(url) < 54 else (0 if len(url) <= 75 else -1)
    
    # 3. Shortining_Service (exact domain match, avoiding false positive substring matches like microsoft.com)
    is_shortener = root_domain in SHORTENER_DOMAINS or any(domain == s.split('.')[0] for s in SHORTENER_DOMAINS)
    features['Shortining_Service'] = -1 if is_shortener else 1
    
    # 4. having_At_Symbol: @ used to obscure URLs
    features['having_At_Symbol'] = -1 if '@' in url else 1
    
    # 5. double_slash_redirecting: // positioned after the protocol
    features['double_slash_redirecting'] = -1 if url.rfind('//') > 7 else 1
    
    # 6. Prefix_Suffix: dash symbol in domain name or subdomain
    features['Prefix_Suffix'] = -1 if ('-' in domain or '-' in subdomain) else 1
    
    # 7. having_Sub_Domain: multiple subdomains or brand spoof in subdomain
    subdomains = [s for s in subdomain.split('.') if s and s != 'www']
    if is_brand_spoof or len(subdomains) >= 2 or (subdomain and '-' in subdomain):
        features['having_Sub_Domain'] = -1
    elif len(subdomains) == 1:
        features['having_Sub_Domain'] = 0
    else:
        features['having_Sub_Domain'] = 1
    
    # 8. SSLfinal_State: Using https with trusted issuer vs untrusted/spoof
    if is_trusted and parsed.scheme == 'https':
        features['SSLfinal_State'] = 1
    elif is_brand_spoof or parsed.scheme != 'https':
        features['SSLfinal_State'] = -1
    elif has_suspicious_words:
        features['SSLfinal_State'] = -1 if parsed.scheme != 'https' else 0
    else:
        features['SSLfinal_State'] = 1 if parsed.scheme == 'https' else -1

    # 9. Domain_registeration_length
    features['Domain_registeration_length'] = 1 if is_trusted else -1

    # 10. Favicon
    features['Favicon'] = 1 if is_trusted else (-1 if is_brand_spoof else 1)

    # 11. port
    features['port'] = -1 if (parsed.port and parsed.port not in [80, 443]) else 1

    # 12. HTTPS_token: 'https' token inside the hostname part
    host_without_scheme = full_host.replace('https', '', 1) if full_host.startswith('https') else full_host
    features['HTTPS_token'] = -1 if 'https' in host_without_scheme or 'http' in host_without_scheme else 1

    # 13. Request_URL: external resources
    features['Request_URL'] = 1 if is_trusted else (-1 if (is_brand_spoof or has_suspicious_words) else 0)

    # 14. URL_of_Anchor: anchors pointing elsewhere or empty
    features['URL_of_Anchor'] = 1 if is_trusted else (-1 if (is_brand_spoof or has_suspicious_words) else 0)

    # 15. Links_in_tags
    features['Links_in_tags'] = 1 if is_trusted else (-1 if (is_brand_spoof or has_suspicious_words) else 0)

    # 16. SFH (Server Form Handler)
    features['SFH'] = 1 if is_trusted else (-1 if (is_brand_spoof or has_suspicious_words) else 0)

    # 17. Submitting_to_email
    features['Submitting_to_email'] = -1 if 'mailto:' in url else 1

    # 18. Abnormal_URL: Hostname does not match brand identity
    features['Abnormal_URL'] = -1 if is_brand_spoof else (1 if is_trusted else 0)

    # 19. Redirect
    features['Redirect'] = -1 if any(p in path_and_query for p in ['redirect=', 'url=', 'goto=', 'return_to=']) else 0

    # 20-23. Client-side scripts
    features['on_mouseover'] = 1
    features['RightClick'] = 1
    features['popUpWidnow'] = 1
    features['Iframe'] = 1

    # 24. age_of_domain: > 6 months for legitimate sites
    features['age_of_domain'] = 1 if is_trusted else -1

    # 25. DNSRecord: Live verification of the domain
    try:
        if features['having_IP_Address'] == 1:
            socket.gethostbyname(full_host.split(':')[0])
        dns_record = 1
    except socket.error:
        dns_record = -1
    features['DNSRecord'] = dns_record

    # 26. web_traffic: Alexa ranking
    features['web_traffic'] = 1 if is_trusted else (-1 if (is_brand_spoof or has_suspicious_words) else 0)

    # 27. Page_Rank
    features['Page_Rank'] = 1 if is_trusted else -1

    # 28. Google_Index
    features['Google_Index'] = 1 if is_trusted else (-1 if (is_brand_spoof or has_suspicious_words) else 0)

    # 29. Links_pointing_to_page
    features['Links_pointing_to_page'] = 1 if is_trusted else (-1 if is_brand_spoof else 0)

    # 30. Statistical_report
    features['Statistical_report'] = -1 if (is_brand_spoof or has_suspicious_words) else 1

    # Ensure columns strictly match the ARFF dataset order used during training
    columns = [
        'having_IP_Address', 'URL_Length', 'Shortining_Service', 'having_At_Symbol',
        'double_slash_redirecting', 'Prefix_Suffix', 'having_Sub_Domain', 'SSLfinal_State',
        'Domain_registeration_length', 'Favicon', 'port', 'HTTPS_token', 'Request_URL',
        'URL_of_Anchor', 'Links_in_tags', 'SFH', 'Submitting_to_email', 'Abnormal_URL',
        'Redirect', 'on_mouseover', 'RightClick', 'popUpWidnow', 'Iframe', 'age_of_domain',
        'DNSRecord', 'web_traffic', 'Page_Rank', 'Google_Index', 'Links_pointing_to_page',
        'Statistical_report'
    ]

    df = pd.DataFrame([features], columns=columns)
    return df
