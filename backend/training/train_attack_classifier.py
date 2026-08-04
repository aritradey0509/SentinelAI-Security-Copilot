import time
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

print("========== ATTACK CLASSIFIER ==========")

start = time.time()

print("Loading dataset...")

df = pd.read_csv("dataset/cicids2017_cleaned.csv")

print(f"Dataset Shape: {df.shape}")

# ---------------------------------
# Take Random Sample
# ---------------------------------

print("Taking random sample...")

df = df.sample(
    n=300000,
    random_state=42
)

print(df["Attack Type"].value_counts())

# ---------------------------------
# Features / Labels
# ---------------------------------

X = df.drop(columns=["Attack Type"])
y = df["Attack Type"]

# Clean data

X = X.replace([np.inf, -np.inf], np.nan)
X = X.fillna(0)

# ---------------------------------
# Split
# ---------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ---------------------------------
# Train Model
# ---------------------------------

print("Training Attack Classifier...")

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

joblib.dump(
    model,
    "models/attack_classifier.pkl"
)

print("\nAttack classifier saved!")

print(f"\nFinished in {time.time()-start:.2f} seconds")