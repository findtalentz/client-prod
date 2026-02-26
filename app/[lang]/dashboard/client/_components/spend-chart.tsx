"use client";

import { AppAreaChart } from "@/components/app-area-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import { ChartConfig } from "@/components/ui/chart";
import ApiResponse from "@/schemas/ApiRespose";
import SpendReport from "@/schemas/SpendReport";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const chartConfig = {
  spend: {
    label: "Spend",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const SpendChart = () => {
  const [timeRange, setTimeRange] = useState("month");

  const { data } = useQuery<ApiResponse<SpendReport>>({
    queryKey: ["spend_report", timeRange],
    queryFn: () =>
      apiClient
        .get<ApiResponse<SpendReport>>("/buyer/spend-report", {
          params: { timeRange },
        })
        .then((r) => r.data),
  });

  const report = data?.data;

  if (!report) return null;

  return (
    <div className="rounded-3xl border shadow p-4 sm:p-5 space-y-4">
      {/* Header: Stats + Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="border-l-2 border-primary/30 pl-3">
            <p className="text-xs text-muted-foreground">Monthly Spending</p>
            <p className="text-sm font-semibold text-primary">
              ${report.monthlySpend}
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-3">
            <p className="text-xs text-muted-foreground">Total Spending</p>
            <p className="text-sm font-semibold text-primary">
              ${report.totalSpend}
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Avg. Project Cost</p>
            <p className="text-sm font-semibold text-primary">
              ${report.averateProjectCost}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      {/* Chart */}
      <AppAreaChart
        data={report.monthlySpendReport}
        config={chartConfig}
        xKey="month"
      />
    </div>
  );
};

export default SpendChart;
