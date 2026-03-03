"use client";

import { AppLineChart, LineChartData } from "@/components/app-line-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ViewsChart() {
  const [timeRange, setTimeRange] = useState("month");

  const numberOfMonth = timeRange === "year" ? 12 : 6;

  const { data } = useQuery<ApiResponse<LineChartData[]>>({
    queryKey: ["views_data", timeRange],
    queryFn: () =>
      apiClient
        .get<ApiResponse<LineChartData[]>>("/views/data", {
          params: { type: "Profile", numberOfMonth },
        })
        .then((r) => r.data),
  });

  const chartData = data?.data;

  if (!chartData) return null;

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Number of Views
        </span>
        <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
      </div>
      <AppLineChart
        config={{
          views: {
            label: "Views",
            color: "var(--primary)",
          },
        }}
        data={chartData}
      />
    </div>
  );
}
