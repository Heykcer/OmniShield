from __future__ import annotations

import datetime
from typing import Any

import httpx
import pytest

from conftest import gateway


class FakeResponse:
    def __init__(self, body: dict[str, Any], status_code: int = 200) -> None:
        self.body = body
        self.status_code = status_code

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise httpx.HTTPStatusError(
                "upstream error",
                request=httpx.Request("GET", "http://service"),
                response=httpx.Response(self.status_code),
            )

    def json(self) -> dict[str, Any]:
        return self.body


class FakeAsyncClient:
    def __init__(self, response: FakeResponse | None = None, error: Exception | None = None) -> None:
        self.response = response
        self.error = error

    async def __aenter__(self) -> FakeAsyncClient:
        return self

    async def __aexit__(self, *_args: Any) -> None:
        return None

    async def post(self, *_args: Any, **_kwargs: Any) -> FakeResponse:
        if self.error:
            raise self.error
        assert self.response is not None
        return self.response

    async def get(self, *_args: Any, **_kwargs: Any) -> FakeResponse:
        if self.error:
            raise self.error
        assert self.response is not None
        return self.response


def test_register_login_normalizes_username_and_rejects_duplicates(client: Any) -> None:
    registered = client.post(
        "/api/auth/register",
        json={"username": "Tester@Example.com", "password": "secure-password"},
    )
    assert registered.status_code == 200
    assert registered.json()["token_type"] == "bearer"

    login = client.post(
        "/api/auth/login",
        json={"username": "TESTER@example.com", "password": "secure-password"},
    )
    assert login.status_code == 200
    assert login.json()["access_token"]

    duplicate = client.post(
        "/api/auth/register",
        json={"username": "tester@example.com", "password": "another-password"},
    )
    assert duplicate.status_code == 400


def test_login_rejects_wrong_password(client: Any) -> None:
    client.post("/api/auth/register", json={"username": "member", "password": "correct-password"})
    response = client.post("/api/auth/login", json={"username": "member", "password": "wrong-password"})
    assert response.status_code == 401


def test_protected_profile_rejects_missing_or_invalid_token(client: Any) -> None:
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": "Bearer invalid"}).status_code == 401


def test_api_key_create_list_and_owner_scoped_revoke(client: Any, auth_headers: dict[str, str]) -> None:
    created = client.post("/api/auth/api-keys", headers=auth_headers)
    assert created.status_code == 200
    api_key = created.json()["api_key"]

    listed = client.get("/api/auth/api-keys", headers=auth_headers)
    assert listed.status_code == 200
    assert [item["api_key"] for item in listed.json()["keys"]] == [api_key]

    other_token = gateway.create_access_token({"sub": "other@example.com"})
    other_headers = {"Authorization": f"Bearer {other_token}"}
    assert client.delete(f"/api/auth/api-keys/{api_key}", headers=other_headers).status_code == 404
    assert client.delete(f"/api/auth/api-keys/{api_key}", headers=auth_headers).status_code == 200
    assert client.get("/api/auth/api-keys", headers=auth_headers).json()["keys"] == []


def test_telemetry_requires_api_key_and_flags_high_risk_event(client: Any, auth_headers: dict[str, str]) -> None:
    payload = {
        "event_type": "api_request",
        "ip_address": "203.0.113.10",
        "request_rate": 1500,
        "payload_size": 60 * 1024 * 1024,
        "user_agent": "sqlmap/1.5",
    }
    assert client.post("/api/external/v1/telemetry", json=payload).status_code == 401

    api_key = client.post("/api/auth/api-keys", headers=auth_headers).json()["api_key"]
    response = client.post(
        "/api/external/v1/telemetry",
        json=payload,
        headers={"X-API-Key": api_key},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Critical"
    assert response.json()["action"] == "BLOCK"
    assert len(gateway.threat_logs_collection.documents) == 1


def test_telemetry_allows_low_risk_event_without_logging(client: Any, auth_headers: dict[str, str]) -> None:
    api_key = client.post("/api/auth/api-keys", headers=auth_headers).json()["api_key"]
    response = client.post(
        "/api/external/v1/telemetry",
        json={"event_type": "api_request", "ip_address": "203.0.113.11"},
        headers={"X-API-Key": api_key},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Safe"
    assert response.json()["action"] == "ALLOW"
    assert gateway.threat_logs_collection.documents == []


def test_phishing_proxy_returns_scan_and_saves_threat_log(
    client: Any, auth_headers: dict[str, str], monkeypatch: pytest.MonkeyPatch
) -> None:
    result = {"url": "https://bad.example", "is_phishing": True, "risk_score": 0.91}
    monkeypatch.setattr(gateway.httpx, "AsyncClient", lambda: FakeAsyncClient(FakeResponse(result)))

    response = client.post(
        "/api/phishing",
        json={"url": "https://bad.example", "model": "xgboost"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json() == result
    assert gateway.threat_logs_collection.documents[0]["risk"] == 91.0


def test_phishing_proxy_reports_unavailable_service(
    client: Any, auth_headers: dict[str, str], monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(
        gateway.httpx,
        "AsyncClient",
        lambda: FakeAsyncClient(error=httpx.ConnectError("offline")),
    )
    response = client.post(
        "/api/phishing",
        json={"url": "https://example.com"},
        headers=auth_headers,
    )
    assert response.status_code == 503


def test_deepfake_proxy_forwards_upload_and_records_result(
    client: Any, auth_headers: dict[str, str], monkeypatch: pytest.MonkeyPatch
) -> None:
    result = {"filename": "sample.mp4", "is_deepfake": False, "risk_score": 0.1}
    monkeypatch.setattr(gateway.httpx, "AsyncClient", lambda: FakeAsyncClient(FakeResponse(result)))

    response = client.post(
        "/api/deepfake",
        files={"file": ("sample.mp4", b"video bytes", "video/mp4")},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json() == result
    assert gateway.threat_logs_collection.documents[0]["tool"] == "Deepfake Forensics"


def test_deepfake_proxy_reports_unavailable_service(
    client: Any, auth_headers: dict[str, str], monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(
        gateway.httpx,
        "AsyncClient",
        lambda: FakeAsyncClient(error=httpx.ConnectError("offline")),
    )
    response = client.post(
        "/api/deepfake",
        files={"file": ("sample.mp4", b"video bytes", "video/mp4")},
        headers=auth_headers,
    )
    assert response.status_code == 503


def test_report_generation_and_listing_are_user_scoped(client: Any, auth_headers: dict[str, str]) -> None:
    gateway.threat_logs_collection.documents.extend(
        [
            {"_id": 1, "username": "tester@example.com", "tool": "XGBOOST URL Model", "status": "Critical", "timestamp": datetime.datetime.utcnow()},
            {"_id": 2, "username": "another-user", "tool": "Deepfake Forensics", "status": "Critical", "timestamp": datetime.datetime.utcnow()},
        ]
    )
    generated = client.post("/api/reports/generate", headers=auth_headers)
    assert generated.status_code == 200
    reports = client.get("/api/reports", headers=auth_headers)
    assert reports.status_code == 200
    assert len(reports.json()) == 1
    assert "Total Scans Executed**: 1" in reports.json()[0]["content"]


def test_dashboard_stats_and_metrics_proxy(
    client: Any, auth_headers: dict[str, str], monkeypatch: pytest.MonkeyPatch
) -> None:
    gateway.threat_logs_collection.documents.append(
        {"username": "tester@example.com", "status": "Critical", "timestamp": datetime.datetime.utcnow()}
    )
    monkeypatch.setattr(gateway.httpx, "AsyncClient", lambda: FakeAsyncClient(FakeResponse({"model_accuracy": 97.2})))

    stats = client.get("/api/stats", headers=auth_headers)
    assert stats.status_code == 200
    assert stats.json()["threats_blocked"] == 1
    assert stats.json()["ml_accuracy"] == "97.2%"

    metrics = client.get("/api/metrics")
    assert metrics.status_code == 200
    assert metrics.json()["model_accuracy"] == 97.2


def test_b2b_analytics_only_returns_current_users_api_key_logs(
    client: Any, auth_headers: dict[str, str]
) -> None:
    gateway.threat_logs_collection.documents.extend(
        [
            {"_id": 1, "username": "tester@example.com", "source": "api_key", "tool": "External API / B2B Scan", "status": "Critical", "timestamp": datetime.datetime.utcnow(), "risk": 85},
            {"_id": 2, "username": "someone-else", "source": "api_key", "tool": "External API / B2B Scan", "status": "Critical", "timestamp": datetime.datetime.utcnow(), "risk": 99},
        ]
    )
    response = client.get("/api/b2b-stats", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["totalApiCalls"] == 1
    assert response.json()["threatsBlocked"] == 1