"use client";
import { AppBarChart } from "@/components/app-bar-chart";
import { cn } from "@/lib/utils";
import SalseReport from "@/schemas/SalseReport";
import { useState } from "react";

interface Props {
  report: SalseReport;
}

const monthlyConfig = {
  earnings: {
    label: "Monthly Earnings",
    color: "var(--color-primary)",
  },
};

export default function MonthlyEarnings({ report }: Props) {
  const [currentTask, setCurrentTask] = useState<"month" | "year">("month");

  const tasks: Array<{ id: number; label: string; value: "month" | "year" }> = [
    { id: 1, label: "This Month", value: "month" },
    { id: 2, label: "This Year", value: "year" },
  ];

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Monthly Earnings
        </span>
        <div className="flex items-center border rounded-full p-[2px]">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setCurrentTask(task.value)}
              className={cn(
                "text-[10px] rounded-full py-1 px-3 cursor-pointer",
                task.value === currentTask && "bg-primary text-white"
              )}
            >
              {task.label}
            </button>
          ))}
        </div>
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
