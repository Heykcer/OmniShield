from collections import OrderedDict, deque
from threading import Lock
from time import monotonic

from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints

ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=256)]

class ATOSignalRequest(BaseModel):
    username: ShortText
    failed_attempts: int = Field(ge=0, le=100)
    ip_address: str | None = Field(default=None, max_length=64)
    user_agent: str | None = Field(default=None, max_length=512)
    country: str | None = Field(default=None, min_length=2, max_length=2)

class Indicator(BaseModel):
    code: str
    detail: str
    contribution: int = Field(ge=0, le=100)
WINDOW_SECONDS = 300
MAX_USERS = 10_000
_events: OrderedDict[str, deque[tuple[float, str | None, str | None, str | None]]] = OrderedDict()
_lock = Lock()


def analyze_login(payload: ATOSignalRequest) -> tuple[int, list[Indicator]]:
    now = monotonic()
    with _lock:
        history = _events.setdefault(payload.username.casefold(), deque())
        cutoff = now - WINDOW_SECONDS
        while history and history[0][0] < cutoff:
            history.popleft()
        prior = history[-1] if history else None
        for _ in range(min(payload.failed_attempts, 20)):
            history.append((now, payload.ip_address, payload.user_agent, payload.country))
        history.append((now, payload.ip_address, payload.user_agent, payload.country))
        _events.move_to_end(payload.username.casefold())
        while len(_events) > MAX_USERS:
            _events.popitem(last=False)
        recent_count = len(history)

    indicators: list[Indicator] = []
    if recent_count >= 6:
        indicators.append(Indicator(code="login_velocity", detail=f"{recent_count} authentication events were observed in the rolling five-minute window.", contribution=min(60, 15 + (recent_count - 5) * 7)))
    if payload.failed_attempts >= 5:
        indicators.append(Indicator(code="failed_attempt_burst", detail=f"The request reports {payload.failed_attempts} recent failed attempts.", contribution=25))
    if prior and payload.country and prior[3] and payload.country.upper() != prior[3].upper():
        indicators.append(Indicator(code="country_shift", detail="The country differs from the previous observed login metadata.", contribution=30))
    if prior and payload.user_agent and prior[2] and payload.user_agent != prior[2]:
        indicators.append(Indicator(code="device_change", detail="The user-agent differs from the previous observed login metadata.", contribution=12))

    return min(100, sum(item.contribution for item in indicators)), indicators