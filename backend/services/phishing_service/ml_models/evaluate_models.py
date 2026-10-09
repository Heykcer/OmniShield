import os
import json
import time
import pandas as pd
from scipy.io import arff
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score, matthews_corrcoef,
    average_precision_score, brier_score_loss, log_loss
)

def evaluate_model(model, X_test, y_test, model_name, model_path):
    start_time = time.time()
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else y_pred
    inference_time = (time.time() - start_time) / len(X_test)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0
    
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    mcc = matthews_corrcoef(y_test, y_pred)
    pr_auc = average_precision_score(y_test, y_pred_proba)
    brier = brier_score_loss(y_test, y_pred_proba)
    ll = log_loss(y_test, y_pred_proba)
    
    model_size = os.path.getsize(model_path) / (1024 * 1024) # MB

    return {
        "Accuracy": round(acc, 4),
        "Precision": round(prec, 4),
        "Recall": round(rec, 4),
        "F1 Score": round(f1, 4),
        "Specificity": round(specificity, 4),
        "False Positive Rate": round(fpr, 4),
        "False Negative Rate": round(fnr, 4),
        "ROC-AUC": round(roc_auc, 4),
        "PR-AUC": round(pr_auc, 4),
        "MCC": round(mcc, 4),
        "Brier Score": round(brier, 4),
        "Log Loss": round(ll, 4),
        "Confusion Matrix": {"TN": int(tn), "FP": int(fp), "FN": int(fn), "TP": int(tp)},
        "Inference Time (ms/sample)": round(inference_time * 1000, 4),
        "Model Size (MB)": round(model_size, 4)
    }

def main():
    print("Loading ARFF dataset for evaluation...")
    data_path = os.path.join(os.path.dirname(__file__), '../data/Training_Dataset.arff')
    data, meta = arff.loadarff(data_path)
    df = pd.DataFrame(data)

    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].str.decode('utf-8').astype(int)

    X = df.drop(columns=['Result'])
    y = (df['Result'] == -1).astype(int)

    # Use same split to get the test set
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    results = {}
    
    models = {
        "XGBoost": "phishing_xgb.pkl",
        "LightGBM": "phishing_lgb.pkl",
        "Random Forest": "phishing_rf.pkl",
        "Master Ensemble": "phishing_master.pkl"
    }

    for name, filename in models.items():
        model_path = os.path.join(os.path.dirname(__file__), filename)
        if os.path.exists(model_path):
            print(f"Evaluating {name}...")
            model = joblib.load(model_path)
            metrics = evaluate_model(model, X_test, y_test, name, model_path)
            results[name] = metrics
        else:
            print(f"Warning: {filename} not found.")

    output_path = os.path.join(os.path.dirname(__file__), 'metrics.json')
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=4)
        
    print(f"All evaluation metrics successfully saved to {output_path}")

if __name__ == "__main__":
    main()
