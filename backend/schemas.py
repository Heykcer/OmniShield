from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints


ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=256)]


class URLScanRequest(BaseModel):
    url: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=4096)]


class BatchURLScanRequest(BaseModel):
    urls: list[Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=4096)]] = Field(min_length=1, max_length=50)


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


class ScanResponse(BaseModel):
    module: str
    target: str
    risk_score: int = Field(ge=0, le=100)
    risk_level: str
    verdict: str
    explanation: str
    indicators: list[Indicator]
    heuristic: bool = True


class HealthResponse(BaseModel):
    status: str
    system: str
    active_modules: list[str]