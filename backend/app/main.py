from pathlib import Path
import sqlite3
from datetime import datetime
from urllib import response

from ollama import chat
from fastapi.responses import FileResponse
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import os
import shutil
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Load Models
# ----------------------------

intrusion_model = joblib.load("models/intrusion_model.pkl")
attack_classifier = joblib.load("models/attack_classifier.pkl")

# ----------------------------
# Explainable AI
# ----------------------------

feature_names = intrusion_model.feature_names_in_.tolist()
feature_importance = intrusion_model.feature_importances_

feature_names = intrusion_model.feature_names_in_.tolist()
feature_importance = intrusion_model.feature_importances_

print("✅ Intrusion Detection Model Loaded")
print("✅ Attack Classification Model Loaded")
# ----------------------------
# SQLite Database
# ----------------------------

conn = sqlite3.connect("sentinelai.db", check_same_thread=False)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    total_packets INTEGER,
    threats INTEGER,
    primary_attack TEXT,
    risk_level TEXT,
    confidence REAL
)
""")

conn.commit()

print("✅ Scan History Database Ready")
# ----------------------------
# Latest Analysis
# ----------------------------

latest_analysis = {
    "total_packets": 0,
    "predicted_attacks": 0,
    "predicted_normal": 0,
    "attack_percentage": 0,
    "average_confidence": 0,
    "risk_level": "Unknown",
    "primary_attack": "Unknown",
    "attack_distribution": {}
}


@app.get("/")
def root():
    return {
        "message": "Welcome to SentinelAI"
    }

MITRE_MAPPING = {
    "DoS": {
        "id": "T1498",
        "name": "Network Denial of Service",
        "description": "The attacker attempts to exhaust network resources to prevent legitimate access."
    },
    "DDoS": {
        "id": "T1498",
        "name": "Network Denial of Service",
        "description": "Distributed denial of service using multiple compromised systems."
    },
    "Port Scanning": {
        "id": "T1046",
        "name": "Network Service Discovery",
        "description": "The attacker scans ports to discover exposed network services."
    },
    "Brute Force": {
        "id": "T1110",
        "name": "Brute Force",
        "description": "Repeated authentication attempts against user accounts."
    },
    "Bots": {
        "id": "T1583",
        "name": "Acquire Infrastructure",
        "description": "Automated bot infrastructure communicating with the target."
    },
    "Web Attacks": {
        "id": "T1190",
        "name": "Exploit Public-Facing Application",
        "description": "Attempts to exploit vulnerabilities in public-facing web applications."
    }
}

AI_ATTACK_INSIGHTS = {
    "DDoS": {
        "summary": "Traffic patterns indicate a Distributed Denial of Service attack designed to overwhelm the target with excessive requests.",
        "impact": [
            "Service disruption",
            "Resource exhaustion",
            "High network latency"
        ],
        "recommendations": [
            "Enable rate limiting",
            "Block malicious IP addresses",
            "Review firewall rules",
            "Monitor server resource utilization"
        ]
    },

    "DoS Hulk": {
        "summary": "High-volume traffic resembles a DoS Hulk attack intended to exhaust server resources.",
        "impact": [
            "Server slowdown",
            "Application unavailability"
        ],
        "recommendations": [
            "Enable WAF protection",
            "Filter abnormal traffic",
            "Inspect source IP addresses"
        ]
    },

    "PortScan": {
        "summary": "Multiple sequential port requests suggest reconnaissance activity before an attack.",
        "impact": [
            "Information gathering",
            "Potential future exploitation"
        ],
        "recommendations": [
            "Block scanning hosts",
            "Review firewall logs",
            "Harden exposed services"
        ]
    },

    "Brute Force": {
        "summary": "Repeated authentication attempts indicate a possible password guessing attack.",
        "impact": [
            "Credential compromise",
            "Unauthorized access"
        ],
        "recommendations": [
            "Enable MFA",
            "Lock accounts after repeated failures",
            "Review authentication logs"
        ]
    },

    "Normal Traffic": {
        "summary": "No malicious activity detected.",
        "impact": [],
        "recommendations": [
            "Continue monitoring traffic."
        ]
    }
}
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global latest_analysis

    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ----------------------------
    # Read CSV
    # ----------------------------

    df = pd.read_csv(file_path)

    features = df.drop(columns=["Attack Type"], errors="ignore")

    features = features.replace([np.inf, -np.inf], np.nan)
    features = features.fillna(0)

    # ----------------------------
    # Binary Intrusion Detection
    # ----------------------------

    predictions = intrusion_model.predict(features)

    probabilities = intrusion_model.predict_proba(features)

    total_packets = len(features)

    predicted_attacks = int(predictions.sum())

    predicted_normal = total_packets - predicted_attacks

    attack_percentage = round(
        (predicted_attacks / total_packets) * 100,
        2
    )

    average_confidence = round(
        probabilities.max(axis=1).mean() * 100,
        2
    )
    # ----------------------------
    # Explainable AI
    # ----------------------------

    importance_df = pd.DataFrame({
        "feature": feature_names,
        "importance": feature_importance
    })

    importance_df = (
        importance_df
        .sort_values("importance", ascending=False)
        .head(5)
    )

    top_features = []

    for _, row in importance_df.iterrows():
        top_features.append({
            "feature": row["feature"],
            "importance": round(float(row["importance"]), 4)
    })
    # ----------------------------
    # Attack Classification
    # ----------------------------

    primary_attack = "Normal Traffic"
    attack_distribution = {}
    if predicted_attacks > 0:

        attack_rows = features[predictions == 1]

        attack_predictions = attack_classifier.predict(attack_rows)

        attack_counts = pd.Series(attack_predictions).value_counts()

        primary_attack = attack_counts.idxmax()

        # Convert attack counts into a dictionary
        attack_distribution = {}

        for attack, count in attack_counts.items():
            attack_distribution[attack] = {
                "count": int(count),
                "percentage": round(
                    (count / predicted_attacks) * 100,
                    2
                )
            }
    mitre = MITRE_MAPPING.get(
    primary_attack,
    {
        "id": "Unknown",
        "name": "Unknown",
        "description": "No MITRE ATT&CK mapping available."
    }
    )
    # ----------------------------
    # AI Attack Insights
    # ----------------------------

    ai = AI_ATTACK_INSIGHTS.get(
        primary_attack,
        {
            "summary": "No AI analysis available for this attack type.",
            "impact": [],
            "recommendations": [
                "Continue monitoring the network."
            ]
        }
    )
        
    # ----------------------------
    # Risk Level
    # ----------------------------

    if attack_percentage < 5:
        risk = "Low"
    elif attack_percentage < 20:
        risk = "Medium"
    else:
        risk = "High"

    # ----------------------------
    # Save Latest Analysis
    # ----------------------------

    # ----------------------------
    # Save Latest Analysis
    # ----------------------------

    latest_analysis = {
        "total_packets": total_packets,
        "predicted_attacks": predicted_attacks,
        "predicted_normal": predicted_normal,
        "attack_percentage": attack_percentage,
        "average_confidence": average_confidence,
        "risk_level": risk,
        "primary_attack": primary_attack,
        "attack_distribution": attack_distribution,
        "mitre": mitre,
        "ai_summary": ai["summary"],
        "impact": ai["impact"],
        "recommendations": ai["recommendations"],
        "top_features": top_features
    }

    cursor.execute(
        """
        INSERT INTO scan_history
        (
            timestamp,
            total_packets,
            threats,
            primary_attack,
            risk_level,
            confidence
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            total_packets,
            predicted_attacks,
            primary_attack,
            risk,
            average_confidence,
        ),
    )

    conn.commit()

    return {
    "message": "Prediction Complete",
    "total_packets": total_packets,
    "predicted_attacks": predicted_attacks,
    "predicted_normal": predicted_normal,
    "attack_percentage": attack_percentage,
    "average_confidence": average_confidence,
    "risk_level": risk,
    "primary_attack": primary_attack,
    "attack_distribution": attack_distribution,
    "mitre": mitre,
    "ai_summary": ai["summary"],
    "impact": ai["impact"],
    "recommendations": ai["recommendations"],
    "top_features": top_features
 }


@app.get("/stats")
def get_stats():
    return latest_analysis


@app.get("/history")
def get_history():

    cursor.execute(
        """
        SELECT
            id,
            timestamp,
            total_packets,
            threats,
            primary_attack,
            risk_level,
            confidence
        FROM scan_history
        ORDER BY id DESC
        LIMIT 20
        """
    )

    rows = cursor.fetchall()

    history = []

    for row in rows:
        history.append(
            {
                "id": row[0],
                "timestamp": row[1],
                "total_packets": row[2],
                "threats": row[3],
                "primary_attack": row[4],
                "risk_level": row[5],
                "confidence": row[6],
            }
        )

    return history


@app.get("/stats")
def get_stats():
    return latest_analysis

from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str


@app.post("/assistant")
def assistant(request: ChatRequest):

    prompt = f"""
You are SentinelAI.

Answer ONLY using the analysis below.

Rules:
- Maximum 3 sentences.
- Do not explain unless asked.
- Do not give mitigation unless the user explicitly asks.
- If information is unavailable, say so.

Analysis:
{latest_analysis}

Question:
{request.question}
"""

    response = chat(
        model="qwen2.5:3b",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )
    print("========== OLLAMA RESPONSE ==========")
    print(response.message.content)
    return {
        "answer": response.message.content
    }

@app.get("/report")
def generate_report():

    filename = "SentinelAI_Incident_Report.pdf"

    doc = SimpleDocTemplate(
        filename,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()

    title = styles["Heading1"]
    title.alignment = TA_CENTER
    title.textColor = colors.HexColor("#0F62FE")

    heading = styles["Heading2"]
    heading.textColor = colors.HexColor("#2563EB")

    normal = styles["BodyText"]
    normal.leading = 18

    elements = []

    # ---------------------------------------------------
    # Header
    # ---------------------------------------------------

    elements.append(Paragraph("🛡 <b>SentinelAI</b>", title))
    elements.append(
        Paragraph(
            "<b>AI Security Assessment Report</b>",
            styles["Title"],
        )
    )

    elements.append(Spacer(1, 0.30 * inch))

    elements.append(
        Paragraph(
            f"Generated: {datetime.now().strftime('%d %B %Y %H:%M:%S')}",
            normal,
        )
    )

    elements.append(Spacer(1, 0.30 * inch))

    # ---------------------------------------------------
    # Executive Summary
    # ---------------------------------------------------

    elements.append(Paragraph("Executive Summary", heading))

    summary = f"""
    The uploaded network traffic was analysed using the SentinelAI intrusion
    detection engine.

    A total of <b>{latest_analysis['predicted_attacks']:,}</b> malicious packets
    were detected out of
    <b>{latest_analysis['total_packets']:,}</b> analysed packets.

    The dominant threat was
    <b>{latest_analysis['primary_attack']}</b> with an overall risk level of
    <b>{latest_analysis['risk_level']}</b>.

    The machine learning model produced a confidence score of
    <b>{latest_analysis['average_confidence']}%</b>.
    """

    elements.append(Paragraph(summary, normal))

    elements.append(Spacer(1, 0.30 * inch))

    # ---------------------------------------------------
    # Threat Statistics
    # ---------------------------------------------------

    elements.append(Paragraph("Threat Statistics", heading))

    table = Table(
        [
            ["Metric", "Value"],
            ["Risk Level", latest_analysis["risk_level"]],
            ["Primary Threat", latest_analysis["primary_attack"]],
            ["Packets Analysed", f"{latest_analysis['total_packets']:,}"],
            ["Threats Detected", f"{latest_analysis['predicted_attacks']:,}"],
            ["Attack Percentage", f"{latest_analysis['attack_percentage']}%"],
            ["Model Confidence", f"{latest_analysis['average_confidence']}%"],
        ],
        colWidths=[220, 220],
    )

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
                ("TOPPADDING", (0, 1), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ]
        )
    )

    elements.append(table)

    elements.append(Spacer(1, 0.35 * inch))

    # ---------------------------------------------------
    # MITRE ATT&CK
    # ---------------------------------------------------

    elements.append(Paragraph("MITRE ATT&CK Mapping", heading))

    mitre = latest_analysis.get("mitre", {})

    elements.append(
        Paragraph(
            f"<b>Technique ID:</b> {mitre.get('id','Unknown')}",
            normal,
        )
    )

    elements.append(
        Paragraph(
            f"<b>Name:</b> {mitre.get('name','Unknown')}",
            normal,
        )
    )

    elements.append(
        Paragraph(
            mitre.get("description", "No mapping available."),
            normal,
        )
    )

    elements.append(Spacer(1, 0.35 * inch))

    # ---------------------------------------------------
    # Explainable AI
    # ---------------------------------------------------

    elements.append(Paragraph("Explainable AI", heading))

    elements.append(
        Paragraph(
            "Top features influencing the prediction:",
            normal,
        )
    )

    for feature in latest_analysis.get("top_features", []):

        elements.append(
            Paragraph(
                f"• <b>{feature['feature']}</b> — {feature['importance']*100:.1f}% importance",
                normal,
            )
        )

    elements.append(Spacer(1, 0.35 * inch))

    # ---------------------------------------------------
    # AI Recommendations
    # ---------------------------------------------------

    elements.append(Paragraph("Recommended Actions", heading))

    for recommendation in latest_analysis.get("recommendations", []):

        elements.append(
            Paragraph(f"• {recommendation}", normal)
        )

    elements.append(Spacer(1, 0.30 * inch))

    # ---------------------------------------------------
    # Footer
    # ---------------------------------------------------

    elements.append(
        Paragraph(
            "<font color='grey'><i>Generated automatically by SentinelAI Security Copilot.</i></font>",
            styles["Italic"],
        )
    )

    doc.build(elements)

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=filename,
    )