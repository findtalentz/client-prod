"use client";

import { AppBarChart } from "@/components/app-bar-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import ApiResponse from "@/schemas/ApiRespose";
import SalseReport from "@/schemas/SalseReport";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const monthlyConfig = {
  earnings: {
    label: "Monthly Earnings",
    color: "var(--color-primary)",
  },
};

export default function MonthlyEarnings() {
  const [timeRange, setTimeRange] = useState("month");

  const { data } = useQuery<ApiResponse<SalseReport>>({
    queryKey: ["monthly_earnings", timeRange],
    queryFn: () =>
      apiClient
        .get<ApiResponse<SalseReport>>("/seller/monthly-earnings", {
          params: { timeRange },
        })
        .then((r) => r.data),
  });

  const report = data?.data;

  if (!report) return null;

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Monthly Earnings
        </span>
        <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
      </div>
      <AppBarChart
        data={report.chartData}
        config={monthlyConfig}
        xAxisKey="month"
        barKeys={["earnings"]}
      />
    </div>
  );
}
