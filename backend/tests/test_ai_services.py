from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path
from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

import pandas as pd
import pytest
from fastapi.testclient import TestClient


BACKEND_ROOT = Path(__file__).resolve().parents[1]
PHISHING_ROOT = BACKEND_ROOT / "services" / "phishing_service"
DEEPFAKE_ROOT = BACKEND_ROOT / "services" / "deepfake_service"
sys.path.insert(0, str(PHISHING_ROOT))


def load_service(name: str, path: Path) -> Any:
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


with patch("joblib.load", return_value=None):
    phishing_service = load_service("phishing_service_test_module", PHISHING_ROOT / "main.py")
sys.modules["cv2"] = types.ModuleType("cv2")
deepfake_service = load_service("deepfake_service_test_module", DEEPFAKE_ROOT / "main.py")
url_features = importlib.import_module("utils.ai_phishing")


class FakeClassifier:
    def __init__(self, probabilities: list[float]) -> None:
        self.probabilities = probabilities

    def predict_proba(self, features: pd.DataFrame) -> list[list[float]]:
        assert len(features) == 1
        return [self.probabilities]


@pytest.fixture
def phishing_client() -> TestClient:
    return TestClient(phishing_service.app)


@pytest.fixture
def deepfake_client() -> TestClient:
    return TestClient(deepfake_service.app)


def test_url_feature_extractor_emits_expected_columns_and_flags_suspicious_parts(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        url_features.tldextract,
        "extract",
        lambda _url: SimpleNamespace(subdomain="login", domain="example", suffix="com"),
    )
    monkeypatch.setattr(url_features.socket, "gethostbyname", lambda _host: "192.0.2.1")

    features = url_features.extract_uci_features("http://login.example.com/verify@account")

    assert features.shape == (1, 30)
    assert features.loc[0, "having_At_Symbol"] == -1
    assert features.loc[0, "SSLfinal_State"] == -1
    assert features.loc[0, "DNSRecord"] == 1


def test_phishing_scan_uses_xgboost_and_returns_risk_factors(
    phishing_client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    features = pd.DataFrame([{"URL_Length": -1, "having_IP_Address": 1, "Shortining_Service": 1,
                              "having_At_Symbol": 1, "double_slash_redirecting": 1, "Prefix_Suffix": 1,
                              "having_Sub_Domain": 1, "SSLfinal_State": 1, "DNSRecord": 1}])
    monkeypatch.setattr(phishing_service, "extract_uci_features", lambda _url: features)
    monkeypatch.setattr(phishing_service, "xgb_model", FakeClassifier([0.1, 0.9]))
    monkeypatch.setattr(phishing_service, "GENAI_API_KEY", "")

    response = phishing_client.post("/scan", json={"url": "http://example.com/very-long-path"})

    assert response.status_code == 200
    result = response.json()
    assert result["is_phishing"] is True
    assert result["risk_score"] == pytest.approx(0.9)
    assert result["model_used"] == "XGBoost"
    assert "Excessive URL length" in result["risk_factors"]


@pytest.mark.parametrize(
    ("model_name", "model_attribute", "expected_label"),
    [("lightgbm", "lgb_model", "LightGBM"), ("rf", "rf_model", "Random Forest")],
)
def test_phishing_scan_supports_alternate_models(
    phishing_client: TestClient,
    monkeypatch: pytest.MonkeyPatch,
    model_name: str,
    model_attribute: str,
    expected_label: str,
) -> None:
    features = pd.DataFrame([{"URL_Length": 1, "having_IP_Address": 1, "Shortining_Service": 1,
                              "having_At_Symbol": 1, "double_slash_redirecting": 1, "Prefix_Suffix": 1,
                              "having_Sub_Domain": 1, "SSLfinal_State": 1, "DNSRecord": 1}])
    monkeypatch.setattr(phishing_service, "extract_uci_features", lambda _url: features)
    monkeypatch.setattr(phishing_service, model_attribute, FakeClassifier([0.95, 0.05]))
    monkeypatch.setattr(phishing_service, "GENAI_API_KEY", "")

    response = phishing_client.post("/scan", json={"url": "https://example.com", "model": model_name})

    assert response.status_code == 200
    assert response.json()["model_used"] == expected_label
    assert response.json()["is_phishing"] is False


def test_phishing_scan_reports_unavailable_model(phishing_client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(phishing_service, "lgb_model", None)
    response = phishing_client.post("/scan", json={"url": "https://example.com", "model": "lightgbm"})
    assert response.status_code == 500
    assert response.json()["detail"] == "LightGBM model not loaded on server."


def test_phishing_metrics_route_returns_metrics_file(phishing_client: TestClient) -> None:
    response = phishing_client.get("/metrics")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_deepfake_video_scan_returns_model_result(
    deepfake_client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(deepfake_service, "GENAI_API_KEY", "")
    monkeypatch.setattr(
        deepfake_service,
        "analyze_video_with_cnn",
        lambda _path, _filename: (0.82, ["synthetic texture evidence"]),
    )

    response = deepfake_client.post(
        "/scan-media",
        files={"file": ("sample.mp4", b"fake video bytes", "video/mp4")},
    )

    assert response.status_code == 200
    assert response.json()["is_deepfake"] is True
    assert response.json()["risk_score"] == pytest.approx(0.82)
    assert response.json()["artifacts_detected"] == ["synthetic texture evidence"]


def test_deepfake_non_video_upload_returns_unsupported_result(
    deepfake_client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(deepfake_service, "GENAI_API_KEY", "")
    response = deepfake_client.post(
        "/scan-media",
        files={"file": ("sample.txt", b"not media", "text/plain")},
    )
    assert response.status_code == 200
    assert "not supported" in response.json()["artifacts_detected"][0]


def test_deepfake_scan_rejects_missing_filename_during_validation(deepfake_client: TestClient) -> None:
    response = deepfake_client.post(
        "/scan-media",
        files={"file": ("", b"no filename", "video/mp4")},
    )
    assert response.status_code == 422