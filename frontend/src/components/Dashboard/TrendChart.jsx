import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function TrendChart() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/history");
    setHistory(res.data.reverse());
  };

  const data = {
    labels: history.map((_, i) => `Scan ${i + 1}`),
    datasets: [
      {
        label: "Confidence %",
        data: history.map((h) => h.confidence),
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="placeholder-card">
      <h2>📈 Confidence Trend</h2>

      <Line data={data} />
    </div>
  );
}

export default TrendChart;