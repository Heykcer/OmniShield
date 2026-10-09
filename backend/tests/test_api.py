from conftest import gateway


def test_gateway_registers_current_api_routes() -> None:
    registered_paths = {route.path for route in gateway.app.routes}
    expected_paths = {
        "/api/auth/register",
        "/api/auth/login",
        "/api/auth/me",
        "/api/auth/api-keys",
        "/api/external/v1/telemetry",
        "/api/external/v1/scan",
        "/api/phishing",
        "/api/deepfake",
        "/api/threats",
        "/api/reports/generate",
        "/api/reports",
        "/api/stats",
        "/api/metrics",
        "/api/b2b-stats",
    }

    assert expected_paths <= registered_paths