import os
import pandas as pd
from scipy.io import arff
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    print("Loading ARFF dataset...")
    data_path = os.path.join(os.path.dirname(__file__), '../data/Training_Dataset.arff')
    data, meta = arff.loadarff(data_path)
    df = pd.DataFrame(data)

    print("Preprocessing data...")
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].str.decode('utf-8').astype(int)

    X = df.drop(columns=['Result'])
    y = (df['Result'] == -1).astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
    model.fit(X_train, y_train)

    print("Evaluating the model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy * 100:.2f}%\n")
    print(classification_report(y_test, y_pred, target_names=['Safe (0)', 'Phishing (1)']))

    # Save the trained model to disk
    model_path = os.path.join(os.path.dirname(__file__), 'phishing_rf.pkl')
    joblib.dump(model, model_path)
    print(f"Success! Model securely saved to {model_path}")

if __name__ == "__main__":
    main()
