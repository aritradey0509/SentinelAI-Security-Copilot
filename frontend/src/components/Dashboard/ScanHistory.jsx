import { useEffect, useState } from "react";
import api from "../../services/api";

function ScanHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/history");
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const badgeColor = (risk) => {
    switch (risk) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="placeholder-card">
      <h2>📜 Scan History</h2>

      <table
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Time</th>
            <th align="left">Threat</th>
            <th align="left">Risk</th>
            <th align="left">Confidence</th>
          </tr>
        </thead>

        <tbody>
          {history.map((scan) => (
            <tr key={scan.id}>
              <td>{scan.timestamp}</td>

              <td>{scan.primary_attack}</td>

              <td>
                <span
                  style={{
                    background: badgeColor(scan.risk_level),
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  {scan.risk_level}
                </span>
              </td>

              <td>{scan.confidence}%</td>
            </tr>
          ))}

          {history.length === 0 && (
            <tr>
              <td colSpan="4">No scans yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ScanHistory;