import { useEffect, useState } from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

import api from "../services/api";

function Reports() {
  const [stats, setStats] = useState({
    total_packets: 0,
    predicted_attacks: 0,
    predicted_normal: 0,
    attack_percentage: 0,
    average_confidence: 0,
    risk_level: "Unknown",
    primary_attack: "Unknown",
    attack_distribution: {},
    mitre: null,
    top_features: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats");
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await api.get("/report", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "SentinelAI_Incident_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    }
  };

  return (
    <>
      <div className="placeholder-card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h2
              style={{
                color: "white",
                marginBottom: "10px",
              }}
            >
              Security Reports
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Generate professional AI-powered incident reports for executive
              review, compliance and forensic analysis.
            </p>
          </div>

          <button
            onClick={downloadReport}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            <FaDownload />
            Download PDF
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#94a3b8",
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >
          <FaFilePdf
            style={{
              color: "#ef4444",
            }}
          />

          <span>
            The report below summarizes the latest network scan and can be
            exported as a professionally formatted PDF.
          </span>
        </div>

      </div>
    </>
  );
}

export default Reports;