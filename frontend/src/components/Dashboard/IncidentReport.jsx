function IncidentReport({ stats }) {
  const summaries = {
    DoS:
      "The uploaded traffic strongly indicates a Denial of Service attack attempting to exhaust system resources and degrade service availability.",

    DDoS:
      "Traffic patterns indicate a Distributed Denial of Service attack originating from multiple hosts with the objective of disrupting service availability.",

    "Port Scanning":
      "Reconnaissance activity was detected. An attacker appears to be enumerating open ports and exposed services before attempting exploitation.",

    "Brute Force":
      "Repeated authentication attempts suggest an active brute-force attack against user credentials.",

    Bots:
      "Automated bot traffic has been detected communicating with monitored systems.",

    "Web Attacks":
      "Suspicious web requests indicate attempts to exploit web application vulnerabilities such as SQL Injection or XSS.",
  };

  const impacts = {
    DoS: "High probability of service disruption and resource exhaustion.",
    DDoS:
      "Critical risk of network outage affecting multiple business services.",
    "Port Scanning":
      "May precede targeted exploitation or lateral movement.",
    "Brute Force":
      "Possible compromise of user accounts and privileged credentials.",
    Bots:
      "Potential automated abuse, scraping, or malware communication.",
    "Web Attacks":
      "Possible compromise of web applications and sensitive data.",
  };

  const recommendations = {
    DoS: [
      "Enable rate limiting.",
      "Block malicious IP addresses.",
      "Inspect firewall logs.",
      "Monitor CPU and bandwidth usage.",
      "Enable DDoS protection if available.",
    ],

    DDoS: [
      "Activate upstream DDoS mitigation.",
      "Block malicious traffic.",
      "Scale network resources.",
      "Monitor edge devices.",
      "Notify network administrators.",
    ],

    "Port Scanning": [
      "Review exposed services.",
      "Restrict unnecessary ports.",
      "Investigate scanner IPs.",
      "Enable IDS alerts.",
      "Review firewall policies.",
    ],

    "Brute Force": [
      "Lock suspicious accounts.",
      "Enable MFA.",
      "Increase password complexity.",
      "Review authentication logs.",
      "Block attacker IPs.",
    ],

    Bots: [
      "Deploy bot filtering.",
      "Inspect outbound traffic.",
      "Review affected hosts.",
      "Update endpoint protection.",
      "Monitor suspicious sessions.",
    ],

    "Web Attacks": [
      "Review web server logs.",
      "Enable WAF protection.",
      "Patch vulnerable applications.",
      "Validate user input.",
      "Monitor application traffic.",
    ],
  };

  const summary =
    summaries[stats.primary_attack] ??
    "No significant malicious activity detected.";

  const impact =
    impacts[stats.primary_attack] ??
    "No immediate business impact identified.";

  const actions =
    recommendations[stats.primary_attack] ?? [
      "Continue monitoring network traffic.",
    ];

  const generated = new Date().toLocaleString();

  return (
    <div className="placeholder-card">
      <h2>📄 AI Incident Report</h2>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <h3>Executive Summary</h3>

      <p
        style={{
          lineHeight: 1.8,
          color: "#d1d5db",
        }}
      >
        {summary}
      </p>

      <br />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
        }}
      >
        <InfoCard title="Threat" value={stats.primary_attack} />
        <InfoCard title="Risk Level" value={stats.risk_level} />
        <InfoCard
          title="Confidence"
          value={`${stats.average_confidence}%`}
        />
        <InfoCard
          title="Threats Detected"
          value={stats.predicted_attacks}
        />
      </div>

      <br />

      <h3>Business Impact</h3>

      <p
        style={{
          lineHeight: 1.8,
          color: "#d1d5db",
        }}
      >
        {impact}
      </p>

      <br />

      <h3>Recommended Actions</h3>

      <ul style={{ lineHeight: 2 }}>
        {actions.map((item, index) => (
          <li key={index}>✅ {item}</li>
        ))}
      </ul>

      <br />

      {stats.mitre && (
        <>
          <h3>MITRE ATT&CK Mapping</h3>

          <div
            style={{
              background: "#111827",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <strong>Technique:</strong> {stats.mitre.technique}

            <br />
            <br />

            <strong>Name:</strong> {stats.mitre.name}

            <br />
            <br />

            <strong>Tactic:</strong> {stats.mitre.tactic}
          </div>

          <br />
        </>
      )}

      <h3>Generated</h3>

      <p>{generated}</p>

      <br />

      <div
        style={{
          display: "flex",
          gap: 15,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            window.open("http://127.0.0.1:8000/report", "_blank")
          }
          style={buttonStyle}
        >
          📥 Download PDF
        </button>

        <button
          onClick={() => window.print()}
          style={buttonStyle}
        >
          🖨 Print
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              JSON.stringify(stats, null, 2)
            );
            alert("Incident copied.");
          }}
          style={buttonStyle}
        >
          📋 Copy Report
        </button>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "#111827",
        padding: 18,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          fontSize: 13,
          opacity: 0.7,
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default IncidentReport;