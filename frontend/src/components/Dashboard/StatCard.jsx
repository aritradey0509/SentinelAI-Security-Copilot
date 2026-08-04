import "./Dashboard.css";

function StatCard({ title, value, change, color }) {
  const isRisk = title === "Risk Level";

  const riskValue =
    value === "High"
      ? 100
      : value === "Medium"
      ? 65
      : value === "Low"
      ? 30
      : 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (riskValue / 100) * circumference;

  return (
    <div className="stat-card">
      <div className="stat-header">
        <h4>{title}</h4>

        <span
          className="status-dot"
          style={{ background: color }}
        ></span>
      </div>

      {isRisk ? (
        <div className="risk-gauge">
          <svg width="120" height="120">
            <circle
              className="gauge-bg"
              cx="60"
              cy="60"
              r={radius}
            />

            <circle
              className="gauge-progress"
              cx="60"
              cy="60"
              r={radius}
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />

            <text
              x="60"
              y="58"
              textAnchor="middle"
              className="gauge-text"
            >
              {riskValue}%
            </text>

            <text
              x="60"
              y="78"
              textAnchor="middle"
              className="gauge-label"
            >
              {value}
            </text>
          </svg>
        </div>
      ) : (
        <>
          <h2>{value}</h2>
          <p>{change}</p>
        </>
      )}
    </div>
  );
}

export default StatCard;