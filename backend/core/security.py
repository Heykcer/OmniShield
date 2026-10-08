import hmac

from fastapi import Header, HTTPException, status

from app.config import get_settings


async def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    """Enforce a single configured key when API_KEY is set; public demo mode is the default."""
    expected = get_settings().api_key
    if expected and (x_api_key is None or not hmac.compare_digest(x_api_key, expected)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")