import ipaddress
import re
from urllib.parse import unquote, urlsplit

from app.schemas import Indicator

SUSPICIOUS_TLDS = {".zip", ".mov", ".click", ".work", ".support", ".country", ".top"}
KEYWORDS = {"login", "verify", "update", "banking", "password", "secure", "wallet", "account"}
INTENT_PHRASES = (
    "verify your account",
    "confirm your password",
    "account will be suspended",
    "urgent action required",
    "update payment information",
)


def analyze_url(value: str) -> tuple[int, list[Indicator]]:
    candidate = value.strip()
    if "://" not in candidate:
        candidate = f"https://{candidate}"
    parsed = urlsplit(candidate)
    host = (parsed.hostname or "").lower().rstrip(".")
    inspected = unquote(f"{host}{parsed.path}?{parsed.query}").lower()
    indicators: list[Indicator] = []

    try:
        ipaddress.ip_address(host.strip("[]"))
        indicators.append(Indicator(code="ip_host", detail="The URL uses a raw IP address instead of a domain.", contribution=35))
    except ValueError:
        pass

    if len(value) > 120:
        indicators.append(Indicator(code="long_url", detail="The URL is unusually long.", contribution=12))

    matched = sorted(keyword for keyword in KEYWORDS if re.search(rf"(?<![a-z]){keyword}(?![a-z])", inspected))
    if matched:
        indicators.append(Indicator(code="credential_terms", detail=f"Sensitive terms appear in the URL: {', '.join(matched[:4])}.", contribution=min(24, 8 + 4 * len(matched))))

    tld = f".{host.rsplit('.', 1)[-1]}" if "." in host else ""
    if tld in SUSPICIOUS_TLDS:
        indicators.append(Indicator(code="risky_tld", detail=f"The hostname uses the higher-risk {tld} top-level domain.", contribution=15))

    if parsed.scheme != "https":
        indicators.append(Indicator(code="no_https", detail="The URL does not use HTTPS.", contribution=8))

    if any(phrase in inspected for phrase in INTENT_PHRASES):
        indicators.append(Indicator(code="urgent_intent", detail="The URL contains credential-harvesting or urgency language.", contribution=18))

    return min(100, sum(item.contribution for item in indicators)), indicators