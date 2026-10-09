import os
import pandas as pd
from scipy.io import arff
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import xgboost as xgb
import lightgbm as lgb
from sklearn.ensemble import RandomForestClassifier, VotingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression

def main():
    print("Loading ARFF dataset...")
    data_path = os.path.join(os.path.dirname(__file__), '../data/Training_Dataset.arff')
    data, meta = arff.loadarff(data_path)
    df = pd.DataFrame(data)

    print("Preprocessing data...")
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].str.decode('utf-8').astype(int)

    # Separate features and target
    X = df.drop(columns=['Result'])
    
    # 1 = Legitimate, -1 = Phishing. We want 1 for Phishing and 0 for Safe
    y = (df['Result'] == -1).astype(int)

    print("Splitting dataset into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Initializing base estimators...")
    xgb_clf = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=7,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss'
    )
    
    lgb_clf = lgb.LGBMClassifier(
        n_estimators=200,
        learning_rate=0.1,
        random_state=42
    )
    
    rf_clf = RandomForestClassifier(
        n_estimators=150,
        max_depth=15,
        random_state=42
    )
    
    print("Building Hybrid Ensemble Strategy...")
    # 1. Soft Voting Classifier
    voting_clf = VotingClassifier(
        estimators=[
            ('xgb', xgb_clf),
            ('lgb', lgb_clf),
            ('rf', rf_clf)
        ],
        voting='soft',
        weights=[0.4, 0.4, 0.2]  # Give more weight to gradient boosting
    )
    
    # 2. Stacking Classifier incorporating Voting
    # The stacking classifier will train a Meta-Model (Logistic Regression) on the predictions
    # of the base models + the voting classifier.
    stacking_clf = StackingClassifier(
        estimators=[
            ('xgb', xgb_clf),
            ('lgb', lgb_clf),
            ('rf', rf_clf),
            ('voting', voting_clf)
        ],
        final_estimator=LogisticRegression(),
        cv=5,
        n_jobs=-1
    )
    
    print("Training Hybrid Master Ensemble Classifier (this may take a minute)...")
    stacking_clf.fit(X_train, y_train)

    print("Evaluating the Master Ensemble model...")
    y_pred = stacking_clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy * 100:.2f}%\n")
    print(classification_report(y_test, y_pred, target_names=['Safe (0)', 'Phishing (1)']))

    # Save the trained model to disk
    model_path = os.path.join(os.path.dirname(__file__), 'phishing_master.pkl')
    joblib.dump(stacking_clf, model_path)
    print(f"Success! Master Ensemble Model securely saved to {model_path}")

if __name__ == "__main__":
    main()
