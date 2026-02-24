"use client";

import { AppPieChart, ChartConfig } from "@/components/app-pie-chart";

const chartData = [
  { category: "Design & Creative", jobCount: 4 },
  { category: "Development & IT", jobCount: 2 },
  { category: "AI Services", jobCount: 3 },
  { category: "Sales & Marketing", jobCount: 3 },
];

const chartConfig: ChartConfig = {
  "Design & Creative": {
    label: "Design & Creative",
    color: "#28C3AB",
  },
  "Development & IT": {
    label: "Development & IT",
    color: "#39F3BB",
  },
  "AI Services": {
    label: "AI Services",
    color: "#1A9395",
  },
  "Sales & Marketing": {
    label: "Sales & Marketing",
    color: "#E2F397",
  },
};

const JobChart = () => {
  return (
    <div className="rounded-3xl border shadow p-4 sm:p-6">
      <h3 className="text-primary font-semibold text-lg mb-4">
        Jobs by Category
      </h3>
      <AppPieChart
        config={chartConfig}
        chartData={chartData}
        dataKey="jobCount"
        nameKey="category"
      />
    </div>
  );
};

export default JobChart;
