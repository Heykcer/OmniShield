from fastapi import APIRouter, Depends

from app.core.security import require_api_key
from app.modules.ato.router import router as ato_router
from app.modules.deepfake.router import router as deepfake_router
from app.modules.phishing.router import build_url_scan, router as phishing_router
from app.schemas import BatchURLScanRequest, ScanResponse, URLScanRequest

router = APIRouter(prefix="/api/v1")
router.include_router(phishing_router)
router.include_router(deepfake_router)
router.include_router(ato_router)


@router.post("/scan-url", response_model=ScanResponse, dependencies=[Depends(require_api_key)])
async def scan_url(payload: URLScanRequest) -> ScanResponse:
	return build_url_scan(payload.url)


@router.post("/scan-batch", response_model=list[ScanResponse], dependencies=[Depends(require_api_key)])
async def scan_batch(payload: BatchURLScanRequest) -> list[ScanResponse]:
	return [build_url_scan(url) for url in payload.urls]