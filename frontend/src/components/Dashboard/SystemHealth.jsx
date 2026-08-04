function SystemHealth() {
  const metrics = [
    { name: "CPU Usage", value: 27, color: "#22c55e" },
    { name: "Memory", value: 54, color: "#f59e0b" },
    { name: "Disk", value: 41, color: "#3b82f6" },
  ];

  return (
    <div className="bg-[#1b2233] rounded-2xl p-6 border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        ⚙️ System Health
      </h2>

      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.name}>
            <div className="flex justify-between text-gray-300 mb-2">
              <span>{metric.name}</span>
              <span>{metric.value}%</span>
            </div>

            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${metric.value}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <span className="text-gray-300">Network</span>

          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Healthy
          </span>
        </div>
      </div>
    </div>
  );
}

export default SystemHealth;