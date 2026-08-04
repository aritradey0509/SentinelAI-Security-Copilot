import { FaRobot, FaShieldAlt } from "react-icons/fa";

function AIInsight({ stats }) {
  const attackDescriptions = {
    "DoS":
      "The uploaded traffic is dominated by Denial of Service (DoS) activity. The attacker is attempting to exhaust network or server resources by sending excessive traffic.",

    "DDoS":
      "The uploaded traffic indicates a Distributed Denial of Service attack originating from multiple sources attempting to overwhelm the target network.",

    "Port Scanning":
      "Reconnaissance activity consistent with network port scanning has been detected. An attacker may be attempting to discover open ports and exposed services.",

    "Brute Force":
      "Repeated authentication attempts indicate a brute-force attack targeting user credentials.",

    "Bots":
      "Automated bot traffic has been detected communicating with the network. This may indicate compromised devices or malicious automation.",

    "Web Attacks":
      "The uploaded traffic contains web application attack patterns that may be attempting to exploit application vulnerabilities.",

    "Normal Traffic":
      "No significant malicious traffic was detected in the uploaded network logs."
  };

  const recommendations = {
    "DoS": [
      "Enable firewall rate limiting.",
      "Inspect server resource utilization.",
      "Block suspicious source IP addresses.",
      "Monitor bandwidth usage."
    ],

    "DDoS": [
      "Enable DDoS mitigation services.",
      "Apply rate limiting.",
      "Filter malicious traffic.",
      "Review upstream firewall rules."
    ],

    "Port Scanning": [
      "Block suspicious IP addresses.",
      "Close unnecessary ports.",
      "Enable IDS monitoring.",
      "Review exposed services."
    ],

    "Brute Force": [
      "Enable account lockout policies.",
      "Use multi-factor authentication.",
      "Review authentication logs.",
      "Block repeated login attempts."
    ],

    "Bots": [
      "Identify compromised hosts.",
      "Inspect outbound traffic.",
      "Update endpoint protection.",
      "Review DNS activity."
    ],

    "Web Attacks": [
      "Inspect web server logs.",
      "Enable Web Application Firewall.",
      "Patch vulnerable applications.",
      "Review HTTP requests."
    ]
  };

  const explanation =
    attackDescriptions[stats.primary_attack] ??
    "Potentially malicious activity has been detected.";

  const actions =
    recommendations[stats.primary_attack] ?? [
      "Continue monitoring the network."
    ];

  return (
    <div className="ai-card">
      <div className="ai-header">
        <FaRobot />
        <h3>AI Security Insight</h3>
      </div>

      <div className="ai-content">

        <div
          className="ai-status"
          style={{
            color:
              stats.risk_level === "High"
                ? "#ef4444"
                : stats.risk_level === "Medium"
                ? "#f59e0b"
                : "#22c55e",
            fontWeight: "bold",
          }}
        >
          <FaShieldAlt />

          <span>
            {stats.risk_level === "High"
              ? "🔴 High Risk Threat"
              : stats.risk_level === "Medium"
              ? "🟡 Suspicious Activity Detected"
              : "🟢 System Secure"}
          </span>

        </div>

        <div style={{ marginTop: "20px" }}>

          <strong>Primary Threat</strong>

          <p>{stats.primary_attack}</p>

          <strong>Attack Rate</strong>

          <p>{stats.attack_percentage}%</p>

          <strong>AI Analysis</strong>

          <p>{explanation}</p>

          <strong>Recommended Actions</strong>

          <ul style={{ paddingLeft: "20px" }}>
            {actions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </div>

      </div>
    </div>
  );
}

export default AIInsight;