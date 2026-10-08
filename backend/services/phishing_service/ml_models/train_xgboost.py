import os
import pandas as pd
from scipy.io import arff
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    print("Loading ARFF dataset...")
    data_path = os.path.join(os.path.dirname(__file__), '../data/Training_Dataset.arff')
    data, meta = arff.loadarff(data_path)
    df = pd.DataFrame(data)

    print("Preprocessing data...")
    # SciPy ARFF loader parses categorical values as byte strings (e.g. b'-1').
    # We decode them and convert to integers.
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].str.decode('utf-8').astype(int)

    # Separate features and target
    X = df.drop(columns=['Result'])
    
    # In the UCI dataset:
    # 1 = Legitimate, -1 = Phishing
    # We want XGBoost to predict 1 for Phishing and 0 for Safe
    y = (df['Result'] == -1).astype(int)

    print("Splitting dataset into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=7,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)

    print("Evaluating the model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy * 100:.2f}%\n")
    print(classification_report(y_test, y_pred, target_names=['Safe (0)', 'Phishing (1)']))

    # Save the trained model to disk
    model_path = os.path.join(os.path.dirname(__file__), 'phishing_xgb.pkl')
    joblib.dump(model, model_path)
    print(f"Success! Model securely saved to {model_path}")

if __name__ == "__main__":
    main()
