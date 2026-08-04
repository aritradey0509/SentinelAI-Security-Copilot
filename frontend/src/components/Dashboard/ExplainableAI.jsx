import "./Dashboard.css";

function ExplainableAI({ stats }) {
  const features = stats.top_features || [];

  const attack =
    stats.primary_attack === "Normal Traffic"
      ? "normal network behaviour"
      : stats.primary_attack;

  return (
    <div className="ai-card explainable-card">

      <div className="ai-header">
        <h3>🧠 Explainable AI</h3>
      </div>

      <div className="xai-summary">

        <div className="xai-confidence">

          <div>
            <span className="xai-label">Model Confidence</span>

            <h2>{stats.average_confidence}%</h2>
          </div>

          <div className="confidence-badge">
            HIGH
          </div>

        </div>

        <p>
          The model classified this traffic as
          <strong> {attack}</strong> because the
          following network features had the greatest
          influence on its prediction.
        </p>

      </div>

      <div className="feature-table">

        {features.map((item, index) => (

          <div className="feature-item" key={index}>

            <div className="feature-top">

              <span className="feature-rank">
                #{index + 1}
              </span>

              <span className="feature-name">
                {item.feature}
              </span>

              <span className="feature-score">
                {(item.importance * 100).toFixed(1)}%
              </span>

            </div>

            <div className="feature-bar-bg">

              <div
                className="feature-bar-fill"
                style={{
                  width: `${item.importance * 100}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ExplainableAI;