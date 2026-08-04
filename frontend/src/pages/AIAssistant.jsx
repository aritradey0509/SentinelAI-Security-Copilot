import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm SentinelAI. Ask me anything about your latest network analysis.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuestion = async (customQuestion = null) => {
    const query = customQuestion || question;

    if (!query.trim()) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
    ...prev,
    {
        role: "user",
        text: query,
        time: now,
    },
    ]);

    // Clear the textbox immediately
    setQuestion("");

    setLoading(true);

    try {
      const response = await api.post("/assistant", {
        question: query,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.answer,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong while contacting the AI.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="placeholder-card">
      <h2>🤖 AI Security Assistant</h2>

      <div
        style={{
          marginTop: 20,
          height: 470,
          overflowY: "auto",
          padding: 10,
          borderRadius: 10,
          background: "#0f172a",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "14px",
                borderRadius: 14,
                background:
                  msg.role === "user"
                    ? "#2563eb"
                    : "#1f2937",
                color: "white",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                }}
              >
                {msg.role === "assistant"
                  ? "🤖 SentinelAI"
                  : "👤 You"}
              </div>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  opacity: 0.7,
                  textAlign: "right",
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                background: "#1f2937",
                color: "white",
                padding: 14,
                borderRadius: 14,
              }}
            >
              🤖 SentinelAI is thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 20,
        }}
      >
        <button
          style={buttonStyle}
          disabled={loading}
          onClick={() =>
            sendQuestion("What is the primary threat?")
          }
        >
          🎯 Primary Threat
        </button>

        <button
          style={buttonStyle}
          disabled={loading}
          onClick={() =>
            sendQuestion("Explain the risk level.")
          }
        >
          ⚠️ Risk
        </button>

        <button
          style={buttonStyle}
          disabled={loading}
          onClick={() =>
            sendQuestion("Show the MITRE ATT&CK mapping.")
          }
        >
          🛡 MITRE
        </button>

        <button
          style={buttonStyle}
          disabled={loading}
          onClick={() =>
            sendQuestion("Give me a summary.")
          }
        >
          📄 Summary
        </button>
      </div>

      <input
        value={question}
        disabled={loading}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendQuestion();
        }}
        placeholder="Ask SentinelAI anything..."
        style={{
          width: "100%",
          marginTop: 20,
          padding: 15,
          borderRadius: 10,
          border: "1px solid #374151",
          background: "#111827",
          color: "white",
          outline: "none",
        }}
      />

      <button
        disabled={loading}
        onClick={() => sendQuestion()}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 14,
          border: "none",
          borderRadius: 10,
          background: "#2563eb",
          color: "white",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AIAssistant;