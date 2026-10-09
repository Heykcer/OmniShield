# OmniShield Manual Testing

Run these checks against the real Docker services. Automated tests use an in-memory database and mocked inference/network calls, so they do not prove Atlas connectivity, container networking, browser behavior, or model quality.

## Run automated tests

From `backend`, use a Python environment with `pytest` and the runtime dependencies for the API gateway and both AI services installed:

```powershell
cd backend
python -m pytest tests -q
```

The gateway tests use an in-memory MongoDB test double. The AI-service tests stub the classifier, Gemini calls, OpenCV import, and downstream inference where appropriate; use the manual steps below for real integration checks.

## Start the services

In PowerShell, start the backend from its directory:

```powershell
cd backend
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f api_gateway
```

Confirm the gateway starts without the MongoDB DNS error. The backend `.env` needs a valid reachable `MONGO_URI`, a strong `JWT_SECRET_KEY`, and any Gemini key used for explanations. In another terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. FastAPI Swagger pages are at `http://localhost:8000/docs`, `http://localhost:8001/docs`, and `http://localhost:8002/docs`.

## Manual cases

| Area | Steps | Expected result |
| --- | --- | --- |
| Registration | On `/login`, switch to account creation and register a new unique email and password. | Registration succeeds and redirects to the dashboard. |
| Duplicate registration | Register the same email again. | A readable “Username already registered” error is shown. |
| Valid login | Sign out/clear the token, then sign in using the account just created. | Login succeeds and dashboard loads. |
| Invalid login | Try the same account with a wrong password. | Login is rejected; it must not show a successful session. |
| Protected page | Clear `omnishield_token` from browser local storage and open `/dashboard` or `/profile`. | The page redirects to login. |
| Profile and API keys | Open `/profile`, generate a key, reload, then revoke it. | Key appears in the list and disappears after revocation. Treat the displayed key as a secret. |
| Phishing scan | In the dashboard, submit a known safe URL and a clearly suspicious test URL. Try each available model. | Each scan returns a score and explanation/risk factors; the UI remains usable if an inference service is stopped. Do not use a URL you do not control for destructive testing. |
| Threat history | After scans, open the dashboard threat log and refresh it. | Your scans appear with a target, tool, score, status, and time. A second user must not see the first user's records. |
| Deepfake upload | Upload a small supported MP4/AVI/MOV video through the dashboard. | A result is returned and a threat-log entry appears. Check startup logs for a loaded trained weights file; without valid weights the service may run with randomly initialized parameters, which is not meaningful detection. |
| Unsupported media | Upload a text file or WAV file. | The current service returns an “unsupported” result for non-video extensions rather than analyzing audio. The frontend currently advertises WAV, so record this as a known UI/backend mismatch. |
| Reports | Generate a report, then open `/reports` and refresh. | A report is generated and listed for the current user only. |
| B2B telemetry | Create an API key in Profile. In Swagger for the gateway, authorize with `X-API-Key` and submit benign telemetry, then a high-risk event with high `request_rate`, large `payload_size`, or suspicious `user_agent`. | Benign event is allowed; high-risk event is flagged/blocked and appears in B2B analytics. An invalid or revoked key is rejected. |
| Pricing and Home | Open `/pricing` and `/`. Click every CTA. | Pages render and links work. Upgrade/billing is not implemented yet, and the Admin Portal is not present in the current codebase. |
| MongoDB outage | Only in a development environment, temporarily use an invalid Mongo URI and restart the gateway. Try login, then restore the valid URI and restart. | Gateway logs show the DB connection failure; login cannot succeed while MongoDB is unavailable. Restore the correct URI immediately. |

## Useful API checks in PowerShell

Register a test account and capture its token:

```powershell
$body = @{ username = "manual-test@example.com"; password = "ChangeThisTestPassword!" } | ConvertTo-Json
$account = Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/auth/register -ContentType "application/json" -Body $body
$token = $account.access_token
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost:8000/api/auth/me -Headers $headers
```

Generate an API key, then use it for telemetry:

```powershell
$key = (Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/auth/api-keys -Headers $headers).api_key
$apiHeaders = @{ "X-API-Key" = $key }
$event = @{
    event_type = "api_request"
    ip_address = "203.0.113.10"
    request_rate = 1500
    payload_size = 62914560
    user_agent = "sqlmap/1.5"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/external/v1/telemetry -Headers $apiHeaders -ContentType "application/json" -Body $event
```

## After a backend change

From `backend`, rebuild and recreate the affected containers:

```powershell
docker compose up -d --build api_gateway phishing_service deepfake_service
docker compose ps
docker compose logs --tail 100 api_gateway phishing_service deepfake_service
```

The frontend is not in the current Compose file; restart it separately with `npm run dev` when testing frontend changes.