"use client";
import { AppLineChart, LineChartData } from "@/components/app-line-chart";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  data: LineChartData[];
}

export default function ViewsChart({ data }: Props) {
  const [currentTask, setCurrentTask] = useState<"month" | "year">("month");

  const tasks: Array<{ id: number; label: string; value: "month" | "year" }> = [
    { id: 1, label: "Six Month", value: "month" },
    { id: 2, label: "One Year", value: "year" },
  ];

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Number of Views
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
      <AppLineChart
        config={{
          views: {
            label: "Views",
            color: "var(--primary)",
          },
        }}
        data={data}
      />
    </div>
  );
}
