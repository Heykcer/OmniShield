import joblib
import json
import warnings
warnings.filterwarnings('ignore')

from utils.ai_phishing import extract_uci_features
import os

model_path = r'c:\Users\Tanjil Alam\Desktop\Projects\OmniShield\backend\services\phishing_service\ml_models\phishing_master.pkl'
metrics_path = r'c:\Users\Tanjil Alam\Desktop\Projects\OmniShield\backend\services\phishing_service\ml_models\metrics.json'

print('\n--- LOADING THE NEW MASTER ENSEMBLE ---')
master_model = joblib.load(model_path)
print('Successfully loaded phishing_master.pkl!')

with open(metrics_path, 'r') as f:
    metrics = json.load(f)
    print(f'Master Ensemble Accuracy from metrics.json: {metrics["Master Ensemble"]["Accuracy"]*100}%')

print('\n--- LIVE TEST: SAFE URL ---')
safe_url = 'https://www.google.com'
features = extract_uci_features(safe_url)
prob_safe = master_model.predict_proba(features)[0][1]
print(f'URL: {safe_url}')
print(f'Phishing Risk Score: {prob_safe * 100:.2f}% (Prediction: {"PHISHING" if prob_safe > 0.5 else "SAFE"})')

print('\n--- LIVE TEST: PHISHING URL ---')
phishing_url = 'http://secure-login-paypal-verify-account.webredirect.org/login'
features_phish = extract_uci_features(phishing_url)
prob_phish = master_model.predict_proba(features_phish)[0][1]
print(f'URL: {phishing_url}')
print(f'Phishing Risk Score: {prob_phish * 100:.2f}% (Prediction: {"PHISHING" if prob_phish > 0.5 else "SAFE"})')
