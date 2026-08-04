import MitreCard from "../components/Dashboard/MitreCard";
import { useEffect, useState } from "react";
import api from "../services/api";
import ScanHistory from "../components/Dashboard/ScanHistory";
import AIInsight from "../components/Dashboard/AIInsight";
import StatCard from "../components/Dashboard/StatCard";
import ThreatChart from "../components/Dashboard/ThreatChart";
import IncidentReport from "../components/Dashboard/IncidentReport";
import "../components/Dashboard/Dashboard.css";
import EventFeed from "../components/Dashboard/EventFeed";
import TrendChart from "../components/Dashboard/TrendChart";
import SystemHealth from "../components/Dashboard/SystemHealth";
import ExplainableAI from "../components/Dashboard/ExplainableAI";

function Dashboard() {
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
});

 useEffect(() => {
  fetchStats();

  const interval = setInterval(() => {
    fetchStats();
  }, 3000); // refresh every 3 seconds

  return () => clearInterval(interval);
 }, []);

  const fetchStats = async () => {
  try {
    const response = await api.get("/stats");
    setStats(response.data);
  } catch (err) {
    console.error(err);
  }
};
  return (
    <>

      <div className="stats-grid">

        <StatCard
          title="Threats Detected"
          value={stats.predicted_attacks}
          change="+12 Today"
          color="#ef4444"
        />

        <StatCard
          title="Files Scanned"
          value={stats.total_packets}
          change="+186 Today"
          color="#3b82f6"
        />

        <StatCard
          title="Risk Level"
          value={stats.risk_level}
          change="Stable"
          color="#22c55e"
        />
        <StatCard
         title="Primary Threat"
         value={stats.primary_attack}
         change="AI Classified"
         color="#a855f7"
        />
        <StatCard
          title="Model Accuracy"
          value={`${stats.average_confidence}%`}
          change="+0.4%"
          color="#f59e0b"
        />

      </div>

      <div className="dashboard-grid">

            <div className="left-panel">
              <ThreatChart stats={stats} />
            </div>

            <div className="right-panel">
              <AIInsight stats={stats} />
            </div>

          </div>

          <div className="explainable-section">
            <ExplainableAI stats={stats} />
          </div>

          <ScanHistory />
          <TrendChart />
          <SystemHealth />
          <EventFeed stats={stats} />
          {stats.mitre && <MitreCard stats={stats} />}

    </>
  );
}

export default Dashboard;