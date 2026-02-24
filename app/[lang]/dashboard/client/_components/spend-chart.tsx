"use client";

import { AppAreaChart } from "@/components/app-area-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import { ChartConfig } from "@/components/ui/chart";
import SpendReport from "@/schemas/SpendReport";
import { useState } from "react";

const chartConfig = {
  spend: {
    label: "Spend",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

interface Props {
  data: SpendReport;
}

const SpendChart = ({ data }: Props) => {
  const [currentTask, setCurrentTask] = useState("month");

  return (
    <div className="rounded-3xl border shadow p-4 sm:p-5 space-y-4">
      {/* Header: Stats + Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="border-l-2 border-primary/30 pl-3">
            <p className="text-xs text-muted-foreground">Monthly Spending</p>
            <p className="text-sm font-semibold text-primary">
              ${data.monthlySpend}
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-3">
            <p className="text-xs text-muted-foreground">Total Spending</p>
            <p className="text-sm font-semibold text-primary">
              ${data.totalSpend}
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Avg. Project Cost</p>
            <p className="text-sm font-semibold text-primary">
              ${data.averateProjectCost}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <TimeRangeToggle value={currentTask} onChange={setCurrentTask} />
        </div>
      </div>

      {/* Chart */}
      <AppAreaChart
        data={data.monthlySpendReport}
        config={chartConfig}
        xKey="month"
      />
    </div>
  );
};

export default SpendChart;
