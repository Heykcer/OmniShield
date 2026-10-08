# CyberGuard Security Engine

A modular FastAPI prototype for URL phishing signals, basic image/WAV frequency analysis, and account-takeover velocity checks. All findings are heuristic indicators for triage; they are not proof that content is malicious, synthetic, or compromised. The service uses in-memory state only, so ATO history is process-local and resets on restart.

## Run locally

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive API.

To run the container from the project root, use `docker compose -f deploy/docker-compose.yml up --build`.

## Endpoints

- `GET /healthz`, `GET /readyz`
- `POST /api/v1/scan-url` with JSON such as `{"url":"https://example.com/login"}`
- `POST /api/v1/scan-batch` with 1-50 URLs
- `POST /api/v1/phishing/scan` with JSON such as `{"url":"https://example.com/login"}`
- `POST /api/v1/deepfake/scan` with multipart field `file` (JPEG, PNG, WebP, or uncompressed WAV; at most 10 MiB by default)
- `POST /api/v1/ato/scan-log` with username, failed-attempt count, and optional IP/device/country metadata

Set `API_KEY` in `.env` to require the `X-API-Key` header on scan endpoints. With no key configured, endpoints are open for local demos. Restrict CORS origins before exposing the service.

## Checks

```powershell
pytest
```

FFT artifacts alone cannot establish deepfake authenticity. The media route intentionally returns a triage signal and should not be used for identity, hiring, credit, or access decisions. Production deployment also needs persistent per-tenant rate limits, key management, auditing, robust model validation, and operational controls.