"use client";
import { AppBarChart } from "@/components/app-bar-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
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
  const [currentTask, setCurrentTask] = useState("month");

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Monthly Earnings
        </span>
        <TimeRangeToggle value={currentTask} onChange={setCurrentTask} />
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
