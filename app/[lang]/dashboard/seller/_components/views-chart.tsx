"use client";
import { AppLineChart, LineChartData } from "@/components/app-line-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import { useState } from "react";

interface Props {
  data: LineChartData[];
}

const viewsTimeOptions = [
  { label: "Six Month", value: "month" },
  { label: "One Year", value: "year" },
];

export default function ViewsChart({ data }: Props) {
  const [currentTask, setCurrentTask] = useState("month");

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Number of Views
        </span>
        <TimeRangeToggle
          value={currentTask}
          onChange={setCurrentTask}
          options={viewsTimeOptions}
        />
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
