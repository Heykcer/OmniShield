# Frontend Manual Testing

Playwright covers repeatable page and interaction checks with mocked backend responses. Use this checklist separately to verify real browser behavior and the real API integration.

## Start the app

Start the backend from the `backend` folder and verify its MongoDB connection first:

```powershell
cd backend
docker compose up -d --build
docker compose ps
docker compose logs -f api_gateway
```

In another terminal, run the frontend:

```powershell
cd frontend
npm run dev
```

Browse to `http://localhost:3000`. Use a test account rather than real credentials.

## Manual browser checks

1. Open Home and verify the logo, desktop navigation, primary links, footer links, and operational indicator render. Resize to mobile and test the menu toggle and navigation.
2. Open Login, create a test account, sign out/clear `omnishield_token` in browser developer tools, and log in again. Try an incorrect password and check the displayed error.
3. Open Dashboard without a token; confirm redirect to Login. Sign in, run a phishing scan using a benign test URL, switch between XGBoost/LightGBM/Random Forest, and inspect the score and threat factors.
4. In Dashboard, switch to Deepfake Forensics, upload a small supported video, and confirm a result and log entry. Try an unsupported file and note the response. Check container logs to verify real model weights loaded; a service running with randomly initialized weights is not a valid accuracy check.
5. Open Live Threat Logs and refresh. Verify scan entries and timestamps; if possible, sign in as a second account and confirm logs are user-scoped.
6. In Profile, view account details, generate an API key, reload, then revoke it. Use test keys only and never paste production secrets into bug reports.
7. Open Developer API Integration. Switch Node.js, Python, and cURL snippets. Verify clipboard behavior using the copy button.
8. Open Analytics and confirm model metrics render. Open B2B Analytics, generate an API key in Profile, and use the simulation button; confirm counters and recent logs update.
9. Open Reports, generate a report, preview it, close the preview, and test the download action. The present download action is a mock alert, not a PDF download.
10. Open Pricing and Services. Confirm the pages render and verify that Upgrade/Contact Sales are not assumed to perform billing; those flows are currently presentation-only.
11. Open `/admin` and record that no Admin Portal route is currently implemented; do not treat a hidden navigation item as an authorization control.
12. In browser developer tools, check Console and Network for failed requests, CORS issues, broken images, or unexpected redirects. In Docker, inspect `docker compose logs --tail 100 api_gateway phishing_service deepfake_service`.

## Known current behavior to account for

- The profile plan label is static, not read from subscription data.
- Profile currently displays full API keys after retrieval.
- WAV is advertised by the dashboard upload control, but the deepfake backend does not analyze audio.
- Report download and some marketing/plan actions are placeholders.
- No admin portal/role-based admin workflow exists yet.