from fastapi import APIRouter, Depends

from app.core.security import require_api_key
from app.modules.ato.engine import analyze_login
from app.schemas import ATOSignalRequest, ScanResponse
from app.shared.xai_engine import aggregate_risk

router = APIRouter(prefix="/ato", tags=["Account Takeover"])


@router.post("/scan-log", response_model=ScanResponse, dependencies=[Depends(require_api_key)])
async def scan_login(payload: ATOSignalRequest) -> ScanResponse:
    score, indicators = analyze_login(payload)
    score, level, explanation = aggregate_risk(indicators, base_score=score)
    return ScanResponse(
        module="account_takeover",
        target=payload.username,
        risk_score=score,
        risk_level=level,
        verdict="ACCOUNT_TAKEOVER_SUSPECTED" if score >= 60 else "NORMAL_OR_REVIEW",
        explanation=explanation,
        indicators=indicators,
    )