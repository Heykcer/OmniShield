from fastapi import APIRouter, Depends

from app.core.security import require_api_key
from app.modules.phishing.engine import analyze_url
from app.schemas import ScanResponse, URLScanRequest
from app.shared.xai_engine import aggregate_risk

router = APIRouter(prefix="/phishing", tags=["Phishing & URL"])


def build_url_scan(url: str) -> ScanResponse:
    score, indicators = analyze_url(url)
    score, level, explanation = aggregate_risk(indicators, base_score=score)
    return ScanResponse(
        module="phishing",
        target=url,
        risk_score=score,
        risk_level=level,
        verdict="SUSPICIOUS" if score >= 40 else "NO_OBVIOUS_RISK",
        explanation=explanation,
        indicators=indicators,
    )


@router.post("/scan", response_model=ScanResponse, dependencies=[Depends(require_api_key)])
async def scan_url(payload: URLScanRequest) -> ScanResponse:
    return build_url_scan(payload.url)