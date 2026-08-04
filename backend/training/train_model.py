import time
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
print("========== NEW TRAINING SCRIPT ==========")

start = time.time()

print("Loading dataset...")

df = pd.read_csv("dataset/cicids2017_cleaned.csv")

print(f"Dataset loaded! Shape: {df.shape}")

# ----------------------------
# Random Sample
# ----------------------------

print("Taking random sample...")

df = df.sample(
    n=300000,
    random_state=42
)

print(f"Sample size: {len(df)}")
print(df["Attack Type"].value_counts())
# ----------------------------
# Binary Labels
# ----------------------------

df["Attack"] = np.where(
    df["Attack Type"] == "Normal Traffic",
    0,
    1
)

# ----------------------------
# Features
# ----------------------------

X = df.drop(columns=["Attack Type", "Attack"])
y = df["Attack"]

# Replace bad values
X = X.replace([np.inf, -np.inf], np.nan)
X = X.fillna(0)

print("Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training Random Forest...")

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=20,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Training Complete!")

predictions = model.predict(X_test)

print("\nAccuracy:")
print(accuracy_score(y_test, predictions))

print("\nClassification Report:")
print(classification_report(y_test, predictions))

joblib.dump(model, "models/intrusion_model.pkl")

print("\nModel saved successfully!")

end = time.time()

print(f"\nTotal time: {end-start:.2f} seconds")