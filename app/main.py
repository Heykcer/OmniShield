import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as v1_router
from app.config import get_settings
from app.core.logging import bind_request_id, configure_logging
from app.schemas import HealthResponse

settings = get_settings()
configure_logging(settings.log_level)
logger = structlog.get_logger()

app = FastAPI(
    title=settings.app_name,
    description="In-memory modular security analysis prototype. Detection results are heuristic, not verdicts.",
    version=settings.app_version,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-API-Key", "X-Request-ID"],
)
app.middleware("http")(bind_request_id)
app.include_router(v1_router)


@app.get("/", response_model=HealthResponse)
@app.get("/healthz", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="online",
        system="CyberGuard Modular Monolith",
        active_modules=["Phishing & URL", "Deepfake Forensics", "Account Takeover Anomaly"],
    )


@app.get("/readyz")
async def readiness_check() -> dict[str, str]:
    return {"status": "ready"}