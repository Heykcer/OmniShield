import io
import wave

import numpy as np
from PIL import Image
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_and_readiness() -> None:
    assert client.get("/healthz").json()["status"] == "online"
    assert client.get("/readyz").json() == {"status": "ready"}


def test_phishing_scan_flags_risky_url() -> None:
    response = client.post("/api/v1/phishing/scan", json={"url": "http://192.0.2.10/verify-account"})
    assert response.status_code == 200
    result = response.json()
    assert result["risk_score"] >= 40
    assert result["verdict"] == "SUSPICIOUS"
    assert {item["code"] for item in result["indicators"]} >= {"ip_host", "credential_terms"}

    tld_response = client.post("/api/v1/phishing/scan", json={"url": "http://example.zip/verify"})
    assert "risky_tld" in {item["code"] for item in tld_response.json()["indicators"]}


def test_url_batch_endpoint() -> None:
    response = client.post(
        "/api/v1/scan-batch",
        json={"urls": ["https://example.com/", "http://example.zip/verify"]},
    )
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_ato_scan_reports_failed_attempt_burst() -> None:
    response = client.post(
        "/api/v1/ato/scan-log",
        json={"username": "test-user", "failed_attempts": 8, "country": "US", "user_agent": "demo"},
    )
    assert response.status_code == 200
    assert response.json()["risk_score"] >= 40


def test_deepfake_scan_rejects_unsupported_upload() -> None:
    response = client.post(
        "/api/v1/deepfake/scan",
        files={"file": ("payload.txt", b"not media", "text/plain")},
    )
    assert response.status_code == 415


def test_deepfake_scan_accepts_image_upload() -> None:
    image_bytes = io.BytesIO()
    Image.new("RGB", (32, 32), color="white").save(image_bytes, format="PNG")
    response = client.post(
        "/api/v1/deepfake/scan",
        files={"file": ("sample.png", image_bytes.getvalue(), "image/png")},
    )
    assert response.status_code == 200
    assert response.json()["indicators"][0]["code"] == "image_fft"


def test_deepfake_scan_accepts_wav_upload() -> None:
    wav_bytes = io.BytesIO()
    samples = (np.sin(np.arange(4096) * 0.1) * 30000).astype(np.int16)
    with wave.open(wav_bytes, "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(16_000)
        audio.writeframes(samples.tobytes())
    response = client.post(
        "/api/v1/deepfake/scan",
        files={"file": ("sample.wav", wav_bytes.getvalue(), "audio/wav")},
    )
    assert response.status_code == 200
    assert response.json()["indicators"][0]["code"] == "audio_fft"


def test_deepfake_scan_rejects_too_short_wav() -> None:
    wav_bytes = io.BytesIO()
    with wave.open(wav_bytes, "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(16_000)
        audio.writeframes(np.zeros(128, dtype=np.int16).tobytes())
    response = client.post(
        "/api/v1/deepfake/scan",
        files={"file": ("short.wav", wav_bytes.getvalue(), "audio/wav")},
    )
    assert response.status_code == 400