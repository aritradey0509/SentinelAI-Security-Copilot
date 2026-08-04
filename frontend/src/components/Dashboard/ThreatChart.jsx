import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

function ThreatChart({ stats }) {
  const distribution = stats.attack_distribution || {};

  const chartData = Object.entries(distribution).map(([name, value]) => ({
    name,
    percentage: value.percentage,
    count: value.count,
  }));

  chartData.sort((a, b) => b.percentage - a.percentage);

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#a855f7",
    "#06b6d4",
    "#ec4899",
  ];

  return (
    <div className="chart-card">

      <h3>Threat Distribution</h3>

      {chartData.length === 0 ? (
        <p>No attack data available.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <XAxis
                type="number"
                unit="%"
              />

              <YAxis
                dataKey="name"
                type="category"
                width={110}
              />

              <Tooltip
                formatter={(value, name, props) => [
                  `${value}%`,
                  "Percentage",
                ]}
              />

              <Bar
                dataKey="percentage"
                radius={[0, 8, 8, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default ThreatChart;