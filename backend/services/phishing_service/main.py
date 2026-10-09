import os
import joblib
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

from utils.ai_phishing import extract_uci_features

# Load the trained Models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'ml_models')

try:
    xgb_model = joblib.load(os.path.join(MODEL_DIR, 'phishing_xgb.pkl'))
except Exception as e:
    print(f"Warning: XGBoost model not found. {e}")
    xgb_model = None

try:
    lgb_model = joblib.load(os.path.join(MODEL_DIR, 'phishing_lgb.pkl'))
except Exception as e:
    print(f"Warning: LightGBM model not found. {e}")
    lgb_model = None

try:
    rf_model = joblib.load(os.path.join(MODEL_DIR, 'phishing_rf.pkl'))
except Exception as e:
    print(f"Warning: Random Forest model not found. {e}")
    rf_model = None

try:
    master_model = joblib.load(os.path.join(MODEL_DIR, 'phishing_master.pkl'))
except Exception as e:
    print(f"Warning: Master Ensemble model not found. {e}")
    master_model = None

# Configure Gemini API for Explainable AI (XAI)
GENAI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

app = FastAPI(title="OmniShield Phishing Service")

# Setup CORS (Internal access usually doesn't need this, but added for safety during dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PhishingRequest(BaseModel):
    url: str
    model: str = "master"

class PhishingResponse(BaseModel):
    url: str
    is_phishing: bool
    risk_score: float
    explanation: str
    model_used: str
    risk_factors: list[str] = []
    
    model_config = {"protected_namespaces": ()}

@app.post("/scan", response_model=PhishingResponse)
async def check_phishing(req: PhishingRequest):
    # 1. Extract the 30 UCI features from the raw URL
    features_df = extract_uci_features(req.url)
    
    # 2. Predict Probability
    if req.model == 'master':
        if master_model is None:
            raise HTTPException(status_code=500, detail="Master Ensemble model not loaded on server.")
        probabilities = master_model.predict_proba(features_df)[0]
        risk_score = float(probabilities[1])
        model_name = "Master Hybrid Ensemble"
    elif req.model == 'lightgbm':
        if lgb_model is None:
            raise HTTPException(status_code=500, detail="LightGBM model not loaded on server.")
        probabilities = lgb_model.predict_proba(features_df)[0]
        risk_score = float(probabilities[1])
        model_name = "LightGBM"
    elif req.model == 'rf':
        if rf_model is None:
            raise HTTPException(status_code=500, detail="Random Forest model not loaded on server.")
        probabilities = rf_model.predict_proba(features_df)[0]
        risk_score = float(probabilities[1])
        model_name = "Random Forest"
    else:
        if xgb_model is None:
            raise HTTPException(status_code=500, detail="XGBoost model not loaded on server.")
        probabilities = xgb_model.predict_proba(features_df)[0]
        risk_score = float(probabilities[1])
        model_name = "XGBoost"

    # Identify specific risk factors from the extracted features
    risk_factors = []
    if features_df['Abnormal_URL'].iloc[0] == -1:
        risk_factors.append("High-risk brand impersonation detected (spoofed company credentials)")
        risk_score = max(risk_score, 0.95)
    if features_df['having_IP_Address'].iloc[0] == -1:
        risk_factors.append("Domain is an IP address instead of a standard name")
        risk_score = max(risk_score, 0.90)
    if features_df['Shortining_Service'].iloc[0] == -1:
        risk_factors.append("Uses a known URL shortening service to hide true destination")
        risk_score = max(risk_score, 0.75)
    if features_df['having_At_Symbol'].iloc[0] == -1:
        risk_factors.append("Contains '@' symbol (often used to trick browsers into hiding the true domain)")
    if features_df['double_slash_redirecting'].iloc[0] == -1:
        risk_factors.append("Contains anomalous '//' redirection inside the path")
    if features_df['Prefix_Suffix'].iloc[0] == -1:
        risk_factors.append("Contains suspicious hyphenation in the domain name")
    if features_df['having_Sub_Domain'].iloc[0] == -1:
        risk_factors.append("Multiple subdomains detected (common in phishing to mimic real brands)")
    if features_df['SSLfinal_State'].iloc[0] == -1:
        risk_factors.append("Does not use secure HTTPS protocol or has untrusted/spoofed certificate")
    if features_df['HTTPS_token'].iloc[0] == -1:
        risk_factors.append("Misleading 'https' token positioned inside domain name")
    if features_df['Redirect'].iloc[0] == -1:
        risk_factors.append("Contains open redirection parameters")
    if features_df['URL_Length'].iloc[0] == -1:
        risk_factors.append("Excessive URL length")
    if features_df['DNSRecord'].iloc[0] == -1:
        risk_factors.append("Domain is not registered or currently offline (No DNS Record)")
        risk_score = max(risk_score, 0.85)
        
    is_phishing = bool(risk_score > 0.5)
        
    if not risk_factors and is_phishing:
        risk_factors.append("Model detected complex nonlinear risk patterns")
    elif not risk_factors:
        risk_factors.append("No major structural risk factors detected")
        
    risk_list_str = "\n".join([f"- {r}" for r in risk_factors])

    # 3. Generate Explainable AI (XAI) response using Gemini
    explanation = ""
    if GENAI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"You are a cybersecurity expert. Our {model_name} model analyzed this URL: {req.url} "
                f"and gave it a phishing risk score of {risk_score*100:.1f}%. "
                f"Based on our feature extraction, here are the major risk factors detected:\n{risk_list_str}\n\n"
                f"Provide a brief, human-readable summary of why this is dangerous (or safe). End your response with the list of Major Risk Factors exactly as provided above."
            )
            response = model.generate_content(prompt)
            explanation = response.text.strip()
        except Exception:
            try:
                model = genai.GenerativeModel("gemini-pro")
                response = model.generate_content(prompt)
                explanation = response.text.strip()
            except Exception:
                explanation = f"**Prediction:** {'PHISHING' if is_phishing else 'LEGITIMATE'}\n\n**Risk Score:** {risk_score*100:.1f}%\n\n**Major Risk Factors:**\n{risk_list_str}"
    else:
        explanation = f"**Prediction:** {'PHISHING' if is_phishing else 'LEGITIMATE'}\n\n**Risk Score:** {risk_score*100:.1f}%\n\n**Major Risk Factors:**\n{risk_list_str}"
        
    return PhishingResponse(
        url=req.url,
        is_phishing=is_phishing,
        risk_score=risk_score,
        explanation=explanation,
        model_used=model_name,
        risk_factors=risk_factors
    )

@app.get("/metrics")
async def get_metrics():
    metrics_path = os.path.join(MODEL_DIR, 'metrics.json')
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Metrics file not found. Run evaluation script first.")
    
    with open(metrics_path, 'r') as f:
        metrics_data = json.load(f)
        
    return metrics_data
