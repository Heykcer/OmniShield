from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.config import get_settings
from app.core.security import require_api_key
from app.modules.deepfake.engine import analyze_image, analyze_wav
from app.schemas import ScanResponse
from app.shared.xai_engine import aggregate_risk

router = APIRouter(prefix="/deepfake", tags=["Deepfake Forensics"])
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "audio/wav", "audio/x-wav"}


@router.post("/scan", response_model=ScanResponse, dependencies=[Depends(require_api_key)])
async def scan_media(file: UploadFile = File(...)) -> ScanResponse:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, WebP, or WAV file")
    data = await file.read(get_settings().max_upload_bytes + 1)
    if len(data) > get_settings().max_upload_bytes:
        raise HTTPException(status_code=413, detail="Upload exceeds the configured size limit")
    try:
        indicators = analyze_wav(data) if file.content_type.startswith("audio/") else analyze_image(data)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    score, level, explanation = aggregate_risk(indicators)
    return ScanResponse(
        module="deepfake_forensics",
        target=file.filename or "uploaded-media",
        risk_score=score,
        risk_level=level,
        verdict="REVIEW_RECOMMENDED" if score >= 40 else "NO_STRONG_SYNTHETIC_SIGNAL",
        explanation=f"{explanation} FFT-only demo analysis is not an authenticity determination.",
        indicators=indicators,
    )