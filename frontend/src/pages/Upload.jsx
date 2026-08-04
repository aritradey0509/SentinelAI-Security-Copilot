import { useState } from "react";
import api from "../services/api";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [completed, setCompleted] = useState(false);

  const simulateProgress = () => {
    const stages = [
      { limit: 20, text: "Uploading Dataset..." },
      { limit: 40, text: "Extracting Features..." },
      { limit: 65, text: "Running AI Detection..." },
      { limit: 85, text: "Classifying Attack Types..." },
      { limit: 95, text: "Generating MITRE ATT&CK Mapping..." },
    ];

    let value = 0;
    let stage = 0;

    const timer = setInterval(() => {
      if (value < stages[stage].limit) {
        value++;
        setProgress(value);
        setStatus(stages[stage].text);
      } else if (stage < stages.length - 1) {
        stage++;
      }
    }, 70);

    return timer;
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setCompleted(false);
    setResult(null);

    setProgress(0);
    setStatus("Preparing Upload...");

    const timer = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData);

      clearInterval(timer);

      setProgress(100);
      setStatus("Analysis Complete");

      setResult(response.data);
      setCompleted(true);
    } catch (err) {
      clearInterval(timer);

      console.error(err);

      alert("Upload failed.");

      setProgress(0);
      setStatus("Upload Failed");
    }

    setLoading(false);
  };

  const resetUpload = () => {
    setCompleted(false);
    setResult(null);
    setFile(null);
    setProgress(0);
    setStatus("Ready");
  };

  return (
    <main className="upload-page">

      <div className="upload-card">

        <h1>📂 Upload Network Logs</h1>

        <p>
          Upload a CSV dataset to perform AI-powered intrusion detection,
          threat classification, MITRE ATT&CK mapping and explainable AI
          analysis.
        </p>

        {!completed ? (

          <>

            <label className="upload-box">

              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <div className="upload-content">

                <div className="upload-icon">
                  ☁️
                </div>

                <h2>Drag & Drop CSV File</h2>

                <span>
                  or click anywhere to browse
                </span>

                {file && (
                  <div className="selected-file">
                    ✅ {file.name}
                  </div>
                )}

              </div>

            </label>

            <button
              className="upload-btn"
              disabled={loading}
              onClick={uploadFile}
            >
              {loading
                ? "Analyzing..."
                : "Analyze Network Traffic"}
            </button>

            {loading && (

              <div className="progress-wrapper">

                <div className="progress-header">

                  <span>{status}</span>

                  <span>{progress}%</span>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

            )}

          </>

        ) : (

          <div className="success-card">

            <div className="success-icon">
              ✅
            </div>

            <h2>Analysis Complete</h2>

            <p>
              Your network traffic has been successfully analyzed.
            </p>

            <div className="summary-grid">

              <div className="summary-box">
                <span>Dataset</span>
                <h3>{file?.name}</h3>
              </div>

              <div className="summary-box">
                <span>Threats</span>
                <h3>{result.predicted_attacks.toLocaleString()}</h3>
              </div>

              <div className="summary-box">
                <span>Risk</span>
                <h3>{result.risk_level}</h3>
              </div>

              <div className="summary-box">
                <span>Confidence</span>
                <h3>{result.average_confidence}%</h3>
              </div>

            </div>

            <button
              className="analyze-again-btn"
              onClick={resetUpload}
            >
              Analyze Another File
            </button>

          </div>

        )}

      </div>

      <div className="info-grid">

        <div className="info-card">

          <h3>Supported Formats</h3>

          <ul>
            <li>✔ CSV Files</li>
            <li>✔ CICIDS2017</li>
            <li>✔ CICIDS2018</li>
            <li>✔ Custom Flow Datasets</li>
          </ul>

        </div>

        <div className="info-card">

          <h3>Analysis Pipeline</h3>

          <ol>
            <li>Upload Dataset</li>
            <li>Feature Extraction</li>
            <li>Threat Detection</li>
            <li>MITRE ATT&CK Mapping</li>
            <li>Explainable AI Analysis</li>
          </ol>

        </div>

      </div>

      {result && (

        <div className="results-card">

          <h2>Latest Scan Results</h2>

          <div className="results-grid">

            <div>
              <span>Packets</span>
              <h3>{result.total_packets.toLocaleString()}</h3>
            </div>

            <div>
              <span>Threats</span>
              <h3>{result.predicted_attacks.toLocaleString()}</h3>
            </div>

            <div>
              <span>Normal</span>
              <h3>{result.predicted_normal.toLocaleString()}</h3>
            </div>

            <div>
              <span>Attack Rate</span>
              <h3>{result.attack_percentage}%</h3>
            </div>

            <div>
              <span>Confidence</span>
              <h3>{result.average_confidence}%</h3>
            </div>

            <div>
              <span>Risk</span>
              <h3>{result.risk_level}</h3>
            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Upload;