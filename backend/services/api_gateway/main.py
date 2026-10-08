import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from database.mongo import init_db

PHISHING_SERVICE_URL = os.getenv("PHISHING_SERVICE_URL", "http://phishing_service:8001")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("API Gateway started! MongoDB connected.")
    except Exception as e:
        print(f"Warning: Failed to connect to MongoDB. Error: {e}")
    yield

app = FastAPI(title="OmniShield API Gateway", lifespan=lifespan)

# Setup CORS for the Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PhishingRequest(BaseModel):
    url: str
    model: str = "xgboost"

@app.post("/api/phishing")
async def check_phishing(req: PhishingRequest):
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
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Phishing ML Service is unreachable: {e}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Error from Phishing ML Service")

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
