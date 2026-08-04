import { useEffect, useState } from "react";

function EventFeed({ stats }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!stats.total_packets) return;

    const now = new Date().toLocaleTimeString();

    setEvents([
      {
        time: now,
        icon: "📁",
        text: "CSV uploaded successfully",
      },
      {
        time: now,
        icon: "🔍",
        text: "Network analysis started",
      },
      {
        time: now,
        icon: "🤖",
        text: "AI classified network traffic",
      },
      {
        time: now,
        icon: "🚨",
        text: `${stats.primary_attack} detected`,
      },
      {
        time: now,
        icon: "🛡",
        text: `Risk Level: ${stats.risk_level}`,
      },
      {
        time: now,
        icon: "📄",
        text: "Incident report generated",
      },
    ]);
  }, [stats]);

  return (
    <div className="placeholder-card">
      <h2>🟢 Live Security Events</h2>

      <div style={{ marginTop: 20 }}>
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 15,
              padding: "12px 0",
              borderBottom: "1px solid #1f2937",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 22 }}>{event.icon}</div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {event.text}
              </div>

              <div
                style={{
                  opacity: 0.6,
                  fontSize: 12,
                }}
              >
                {event.time}
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p>No security events yet.</p>
        )}
      </div>
    </div>
  );
}

export default EventFeed;