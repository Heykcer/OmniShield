import re
import socket
import pandas as pd
from urllib.parse import urlparse
import tldextract

def extract_uci_features(url: str) -> pd.DataFrame:
    """
    Extracts the 30 specific features required by the UCI Phishing Dataset format.
    Returns a Pandas DataFrame that can be fed directly into the trained XGBoost model.
    Values are generally: 1 (Safe), 0 (Suspicious), -1 (Phishing)
    """
    if not url.startswith('http'):
        url = 'http://' + url
        
    parsed = urlparse(url)
    ext = tldextract.extract(url)
    domain = ext.domain
    
    features = {}
    
    # 1. having_IP_Address: if domain is IP address
    features['having_IP_Address'] = -1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', domain) else 1
    
    # 2. URL_Length: <54 safe, 54-75 suspicious, >75 phishing
    features['URL_Length'] = 1 if len(url) < 54 else (0 if len(url) <= 75 else -1)
    
    # 3. Shortining_Service
    shorteners = ['bit.ly', 'goo.gl', 't.co', 'tinyurl', 'ow.ly', 'is.gd']
    features['Shortining_Service'] = -1 if any(s in url for s in shorteners) else 1
    
    # 4. having_At_Symbol: @ used to obscure URLs
    features['having_At_Symbol'] = -1 if '@' in url else 1
    
    # 5. double_slash_redirecting: // positioned after the protocol
    features['double_slash_redirecting'] = -1 if url.rfind('//') > 7 else 1
    
    # 6. Prefix_Suffix: dash symbol in domain
    features['Prefix_Suffix'] = -1 if '-' in domain else 1
    
    # 7. having_Sub_Domain: >2 subdomains is phishing
    subdomains = ext.subdomain.split('.') if ext.subdomain else []
    features['having_Sub_Domain'] = 1 if len(subdomains) == 0 else (0 if len(subdomains) == 1 else -1)
    
    # 8. SSLfinal_State: Using https
    features['SSLfinal_State'] = 1 if parsed.scheme == 'https' else -1

    # 9. DNSRecord: Live verification of the domain
    full_domain = ".".join(part for part in [ext.subdomain, ext.domain, ext.suffix] if part)
    try:
        if features['having_IP_Address'] == 1: # Only do DNS lookup if it's a domain name
            socket.gethostbyname(full_domain)
        dns_record = 1
    except socket.error:
        dns_record = -1
    
    # Fill the rest of the 30 features with heuristic defaults to satisfy the XGBoost model dimensions
    defaults = {
        'Domain_registeration_length': 1, 'Favicon': 1, 'port': 1,
        'HTTPS_token': -1 if 'https' in domain else 1,
        'Request_URL': 1, 'URL_of_Anchor': 0, 'Links_in_tags': 0,
        'SFH': 1, 'Submitting_to_email': -1 if 'mailto:' in url else 1,
        'Abnormal_URL': 1, 'Redirect': 0, 'on_mouseover': 1,
        'RightClick': 1, 'popUpWidnow': 1, 'Iframe': 1,
        'age_of_domain': 1, 'DNSRecord': dns_record, 'web_traffic': 0,
        'Page_Rank': -1, 'Google_Index': 1, 'Links_pointing_to_page': 0,
        'Statistical_report': 1
    }
    
    for k, v in defaults.items():
        features[k] = v
        
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
    
    # Return as a Pandas DataFrame exactly as the XGBoost predict() method expects
    df = pd.DataFrame([features], columns=columns)
    return df
