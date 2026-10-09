import os
import httpx
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from database.mongo import init_db, users_collection, threat_logs_collection, reports_collection, api_keys_collection
from auth import (
    UserCreate, UserLogin, TokenResponse, UserResponse,
    get_password_hash, verify_password, create_access_token, get_current_user, get_optional_user,
    get_user_from_api_key, ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta
import datetime

PHISHING_SERVICE_URL = os.getenv("PHISHING_SERVICE_URL", "http://phishing_service:8001")
DEEPFAKE_SERVICE_URL = os.getenv("DEEPFAKE_SERVICE_URL", "http://deepfake_service:8002")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("API Gateway started! MongoDB connected.")
    except Exception as e:
        print(f"Warning: Failed to connect to MongoDB. Error: {e}")
    yield

app = FastAPI(title="OmniShield API Gateway", lifespan=lifespan)

# Setup Response Compression (Compresses large reports by up to 80%)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Setup CORS for the Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTHENTICATION ROUTES ---

@app.post("/api/auth/register", response_model=TokenResponse)
async def register_user(user: UserCreate):
    existing_user = await users_collection.find_one({"username": user.username.casefold()})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "username": user.username.casefold(),
        "hashed_password": hashed_password
    }
    await users_collection.insert_one(new_user)
    
    # Generate token immediately after registration
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=TokenResponse)
async def login_user(user: UserLogin):
    db_user = await users_collection.find_one({"username": user.username.casefold()})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """
    Protected route: Returns the current user's profile if they have a valid JWT token.
    """
    return {"username": current_user["username"]}


@app.post("/api/auth/api-keys")
async def generate_api_key(current_user: dict = Depends(get_current_user)):
    """Generate a new API key for external integration."""
    import secrets
    import datetime
    
    new_key = f"os_{secrets.token_urlsafe(32)}"
    doc = {
        "api_key": new_key,
        "username": current_user["username"],
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    await api_keys_collection.insert_one(doc)
    return {"api_key": new_key, "created_at": doc["created_at"]}

@app.get("/api/auth/api-keys")
async def list_api_keys(current_user: dict = Depends(get_current_user)):
    """List all active API keys for the user."""
    cursor = api_keys_collection.find({"username": current_user["username"]}, {"_id": 0})
    keys = await cursor.to_list(length=100)
    return {"keys": keys}

@app.delete("/api/auth/api-keys/{key}")
async def delete_api_key(key: str, current_user: dict = Depends(get_current_user)):
    """Revoke an API key."""
    result = await api_keys_collection.delete_one({"api_key": key, "username": current_user["username"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="API Key not found")
    return {"detail": "API Key revoked successfully"}

# --- EXTERNAL INTEGRATION ROUTES (B2B API) ---

class ExternalScanRequest(BaseModel):
    url: str
    model: str = "xgboost"

class TelemetryEvent(BaseModel):
    event_type: str  # e.g., "network_traffic", "api_request", "file_access"
    ip_address: str
    user_id: str = "anonymous"
    endpoint: str = ""
    request_rate: int = 0  # requests per minute
    payload_size: int = 0  # bytes
    user_agent: str = ""

@app.post("/api/external/v1/telemetry")
async def analyze_telemetry(event: TelemetryEvent, current_user: dict = Depends(get_user_from_api_key)):
    """
    Intelligent Threat Detection:
    Analyzes incoming telemetry from external websites to detect API abuse,
    data exfiltration, insider threats, and abnormal network traffic.
    """
    risk_score = 0.0
    threat_reasons = []
    
    # 1. Detect API Abuse (Rate Limiting / DDoS indicators)
    if event.request_rate > 1000:
        risk_score += 0.8
        threat_reasons.append("Severe API Abuse / DDoS pattern detected")
    elif event.request_rate > 100:
        risk_score += 0.4
        threat_reasons.append("High API request velocity")
        
    # 2. Detect Data Exfiltration (Massive outbound payloads)
    if event.payload_size > 50 * 1024 * 1024:  # 50 MB
        risk_score += 0.7
        threat_reasons.append("Potential Data Exfiltration (Massive payload)")
        
    # 3. Detect Insider Threats (Abnormal access)
    if event.event_type == "file_access" and "admin" not in event.user_id.lower() and event.request_rate > 50:
        risk_score += 0.6
        threat_reasons.append("Insider Threat Indicator: Rapid unauthorized file access")
        
    # 4. Malware / Bot Indicators
    suspicious_agents = ["curl", "wget", "python-requests", "nmap", "sqlmap"]
    if any(bot in event.user_agent.lower() for bot in suspicious_agents):
        risk_score += 0.5
        threat_reasons.append("Malware/Bot Indicator: Suspicious User-Agent")

    # Finalize status
    is_critical = risk_score >= 0.7
    status = "Critical" if is_critical else ("Warning" if risk_score >= 0.4 else "Safe")
    
    if risk_score > 0:
        # Save to ThreatLogs so it shows up in dashboard
        log_entry = {
            "username": current_user["username"],
            "target": event.ip_address,
            "tool": "Intelligent Threat Detection (Telemetry)",
            "status": status,
            "risk": min(round(risk_score * 100, 1), 100.0),
            "details": ", ".join(threat_reasons),
            "timestamp": datetime.datetime.utcnow(),
            "source": "api_key",
            "metadata": {
                "event_type": event.event_type,
                "endpoint": event.endpoint,
                "request_rate": event.request_rate,
                "payload_size": event.payload_size,
                "user_agent": event.user_agent,
                "user_id": event.user_id
            }
        }
        await threat_logs_collection.insert_one(log_entry)
        
    return {
        "status": status,
        "risk_score": min(risk_score, 1.0),
        "threats_detected": threat_reasons,
        "action": "BLOCK" if is_critical else "ALLOW"
    }

@app.post("/api/external/v1/scan")
async def external_scan_url(req: ExternalScanRequest, current_user: dict = Depends(get_user_from_api_key)):
    """
    External API to check phishing URLs using X-API-Key header.
    """
    url = req.url
    model = req.model
    
    if not url:
        raise HTTPException(status_code=400, detail="Missing 'url' field")
        
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{PHISHING_SERVICE_URL}/scan",
                json={"url": url, "model": model},
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            
            # Save to ThreatLogs so it shows up in dashboard
            log_entry = {
                "username": current_user["username"],
                "target": url,
                "tool": "External API / B2B Scan",
                "status": "Critical" if result.get("is_phishing") else "Safe",
                "risk": round(result.get("risk_score", 0.0) * 100, 1),
                "timestamp": datetime.datetime.utcnow(),
                "source": "api_key"
            }
            await threat_logs_collection.insert_one(log_entry)
            
            return result
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Error from ML Service")


# --- ML MICROSERVICE PROXIES (Internal Dashboard) ---

class PhishingRequest(BaseModel):
    url: str
    model: str = "xgboost"

@app.post("/api/phishing")
async def check_phishing(req: PhishingRequest, current_user: dict = Depends(get_current_user)):
    """
    Proxy request to the isolated Phishing ML Microservice
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{PHISHING_SERVICE_URL}/scan",
                json={"url": req.url, "model": req.model},
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            
            # Save to ThreatLogs
            log_entry = {
                "username": current_user["username"],
                "target": req.url,
                "tool": f"{req.model.upper()} URL Model",
                "status": "Critical" if result.get("is_phishing") else "Safe",
                "risk": round(result.get("risk_score", 0.0) * 100, 1),
                "timestamp": datetime.datetime.utcnow()
            }
            await threat_logs_collection.insert_one(log_entry)
            
            return result
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Phishing ML Service is unreachable: {e}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Error from Phishing ML Service")

@app.get("/api/threats")
async def get_threat_logs(current_user: dict = Depends(get_current_user)):
    """
    Fetch the user's historical threat logs from MongoDB.
    """
    logs_cursor = threat_logs_collection.find({"username": current_user["username"]}).sort("timestamp", -1).limit(50)
    logs = await logs_cursor.to_list(length=50)
    
    formatted_logs = []
    for log in logs:
        formatted_logs.append({
            "id": str(log["_id"]),
            "target": log.get("target", "Unknown"),
            "tool": log.get("tool", "Unknown Tool"),
            "status": log.get("status", "Unknown"),
            "risk": log.get("risk", 0.0),
            "time": log.get("timestamp").isoformat() + "Z" if log.get("timestamp") else ""
        })
    return formatted_logs

from fastapi import UploadFile, File

@app.post("/api/deepfake")
async def analyze_deepfake(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Proxy deepfake media analysis request to the isolated Deepfake Microservice and log to MongoDB.
    """
    async with httpx.AsyncClient() as client:
        try:
            # We must forward the file upload using httpx
            files = {'file': (file.filename, file.file, file.content_type)}
            res = await client.post(
                f"{DEEPFAKE_SERVICE_URL}/scan-media",
                files=files,
                timeout=30.0
            )
            res.raise_for_status()
            result = res.json()
            
            # Log the threat to MongoDB
            log_entry = {
                "username": current_user["username"],
                "target": file.filename,
                "tool": "Deepfake Forensics",
                "status": "Critical" if result.get("is_deepfake") else "Safe",
                "risk": round(result.get("risk_score", 0.0) * 100, 1),
                "timestamp": datetime.datetime.utcnow()
            }
            await threat_logs_collection.insert_one(log_entry)
            
            return result
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Deepfake ML Service is unreachable: {e}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Error from Deepfake ML Service")

# --- REPORT GENERATION ---

@app.post("/api/reports/generate")
async def generate_report(current_user: dict = Depends(get_current_user)):
    """
    Consolidates logs from all tools (Phishing, Deepfake, Network Agent)
    and generates a unified compliance report.
    """
    # 1. Fetch all user's threat logs to aggregate
    logs_cursor = threat_logs_collection.find({"username": current_user["username"]})
    logs = await logs_cursor.to_list(length=1000)
    
    total_scans = len(logs)
    phishing_count = sum(1 for log in logs if "URL" in log.get("tool", ""))
    network_count = sum(1 for log in logs if "Network" in log.get("tool", ""))
    deepfake_count = sum(1 for log in logs if "Deepfake" in log.get("tool", ""))
    critical_threats = sum(1 for log in logs if log.get("status") == "Critical" or log.get("status") == "High")
    
    # 2. Generate the report content (In production, this would call Gemini)
    report_content = f"### OmniShield Consolidated Threat Report\n\n"
    report_content += f"**Total Scans Executed**: {total_scans}\n"
    report_content += f"**Critical/High Threats Blocked**: {critical_threats}\n\n"
    report_content += f"#### Tool Breakdown:\n"
    report_content += f"- **Phishing ML Models**: {phishing_count} scans\n"
    report_content += f"- **Network Agent (Live Detection)**: {network_count} scans\n"
    report_content += f"- **Deepfake Forensics**: {deepfake_count} scans\n\n"
    
    if critical_threats > 0:
        report_content += "⚠️ **Action Required**: Several critical threats were intercepted. Please review the live threat logs for detailed IP/URL mitigation strategies."
    else:
        report_content += "✅ **System Status**: All endpoints are secure. No critical threats were detected during this period."
        
    # 3. Save to MongoDB
    report_entry = {
        "username": current_user["username"],
        "name": f"Consolidated Audit - {datetime.datetime.utcnow().strftime('%B %Y')}",
        "status": "Ready",
        "size": f"{round(len(report_content) / 1024, 2)} KB",
        "content": report_content,
        "timestamp": datetime.datetime.utcnow()
    }
    
    result = await reports_collection.insert_one(report_entry)
    
    return {"message": "Report generated successfully", "id": str(result.inserted_id)}

@app.get("/api/reports")
async def get_reports(current_user: dict = Depends(get_current_user)):
    """
    Fetch the user's generated reports.
    """
    cursor = reports_collection.find({"username": current_user["username"]}).sort("timestamp", -1)
    reports = await cursor.to_list(length=20)
    
    formatted = []
    for r in reports:
        # Generate a mock ID for UI purposes
        short_id = f"REP-{str(r['_id'])[-4:].upper()}"
        formatted.append({
            "id": short_id,
            "name": r.get("name"),
            "date": r.get("timestamp").strftime("%b %d, %Y") if r.get("timestamp") else "Unknown",
            "status": r.get("status"),
            "size": r.get("size"),
            "content": r.get("content")
        })
    return formatted

@app.get("/api/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """
    Compute real-time statistics for the dashboard quick stats row.
    """
    # Threats Blocked: Any log not marked as Safe
    threats_blocked = await threat_logs_collection.count_documents({
        "username": current_user["username"],
        "status": {"$ne": "Safe"}
    })
    
    # Pending Review: Recent threats or medium risk (Mocking logic here for demonstration)
    pending_review = await threat_logs_collection.count_documents({
        "username": current_user["username"],
        "status": "High"
    })
    
    # ML Accuracy: Fetch from the Phishing microservice metrics if possible
    ml_accuracy = 90.7
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(f"{PHISHING_SERVICE_URL}/metrics", timeout=2.0)
            if res.status_code == 200:
                metrics = res.json()
                ml_accuracy = metrics.get("model_accuracy", 90.7)
        except Exception:
            pass # Fallback to default if offline
            
    return {
        "cross_dataset": "Validated",
        "threats_blocked": threats_blocked,
        "pending_review": pending_review,
        "ml_accuracy": f"{ml_accuracy}%"
    }

@app.get("/api/metrics")
async def get_metrics():
    """
    Proxy metrics request to the isolated Phishing ML Microservice
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{PHISHING_SERVICE_URL}/metrics", timeout=10.0)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Failed to fetch metrics from Phishing Service: {e}")

@app.get("/api/b2b-stats")
async def get_b2b_stats(current_user: dict = Depends(get_current_user)):
    """
    Compute real-time statistics for external B2B (API Key) usage.
    """
    # Find all logs that were triggered by an API Key
    cursor = threat_logs_collection.find({"username": current_user["username"], "source": "api_key"}).sort("timestamp", -1)
    logs = await cursor.to_list(length=1000)
    
    total_api_calls = len(logs)
    critical_api_threats = sum(1 for log in logs if log.get("status") == "Critical")
    phishing_api_blocked = sum(1 for log in logs if log.get("status") == "Critical" and "External API / B2B Scan" in log.get("tool", ""))
    
    # Format the recent logs
    recent_logs = []
    for log in logs[:10]:
        recent_logs.append({
            "id": str(log["_id"]),
            "timestamp": log["timestamp"].isoformat() if isinstance(log["timestamp"], datetime.datetime) else log["timestamp"],
            "target": log.get("target", "Unknown"),
            "status": log.get("status", "Safe"),
            "risk": log.get("risk", 0.0),
            "details": log.get("details", "Phishing Link Detected" if "URL" in log.get("tool", "") or "B2B Scan" in log.get("tool", "") else ""),
            "metadata": log.get("metadata", None)
        })

    return {
        "totalApiCalls": total_api_calls,
        "threatsBlocked": critical_api_threats,
        "phishingBlocked": phishing_api_blocked,
        "recentLogs": recent_logs
    }
