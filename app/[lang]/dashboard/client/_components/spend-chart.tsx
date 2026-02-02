"use client";

import { AppAreaChart } from "@/components/app-area-chart";
import { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import SpendReport from "@/schemas/SpendReport";
import { Grid } from "@radix-ui/themes";
import { useState } from "react";

export const description = "An area chart with gradient fill";

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
  const [currentTask, setCurrentTask] = useState<"month" | "year">("month");

  const tasks: Array<{ id: number; label: string; value: "month" | "year" }> = [
    { id: 1, label: "This Month", value: "month" },
    { id: 2, label: "This Year", value: "year" },
  ];
  return (
    <div className="rounded-3xl border shadow py-5">
      <div>
        <Grid
          columns={{ initial: "2", lg: "2fr 2fr 3fr 3fr" }}
          gap={{ initial: "2", md: "1" }}
          className="mb-15 px-3"
        >
          <div className="border-s ps-1">
            <p className="text-primary !text-[12px]">Monthly Spending</p>
            <p className="text-primary font-semibold">${data.monthlySpend}</p>
          </div>

          <div className="border-s ps-1">
            <p className="text-primary !text-[12px]">Total Spending</p>
            <p className="text-primary font-semibold">${data.totalSpend}</p>
          </div>

          <div className="border-s ps-1">
            <p className="text-primary !text-[12px]">Average Project Cost</p>
            <p className="text-primary font-semibold">
              ${data.averateProjectCost}
            </p>
          </div>
          <div className="flex items-center justify-end border-l">
            <div className="flex items-center border rounded-full p-[2px] w-fit">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setCurrentTask(task.value)}
                  className={cn(
                    "text-[10px] rounded-full py-1.5 px-3 cursor-pointer",
                    task.value === currentTask && "bg-primary text-white"
                  )}
                >
                  {task.label}
                </button>
              ))}
            </div>
          </div>
        </Grid>
        <AppAreaChart
          data={data.monthlySpendReport}
          config={chartConfig}
          xKey="month"
        />
      </div>
    </div>
  );
};

export default SpendChart;
