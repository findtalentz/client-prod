"use client";
import { AppPieChart } from "@/components/app-pie-chart";
import { cn } from "@/lib/utils";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import { useState } from "react";
import CompletedJobs from "./completed-jobs";

interface Props {
  data: ActiveJobReport;
}

function ActiveJobs({ data }: Props) {
  const [currentTask, setCurrentTask] = useState<"month" | "year">("month");

  const tasks: Array<{ id: number; label: string; value: "month" | "year" }> = [
    { id: 1, label: "This Month", value: "month" },
    { id: 2, label: "This Year", value: "year" },
  ];

  const config = {
    [data.rankOneByCategory?.category ?? ""]: {
      label: data.rankOneByCategory?.category ?? "",
      color: "#4285F4",
    },
    [data.rankTwoByCategory?.category ?? ""]: {
      label: data.rankTwoByCategory?.category ?? "",
      color: "#34A853",
    },
    [data.rankThreeByCategory?.category ?? ""]: {
      label: data.rankThreeByCategory?.category ?? "",
      color: "#FBBC05",
    },
    [data.rankFourByCategory?.category ?? ""]: {
      label: data.rankFourByCategory?.category ?? "",
      color: "#EA4335",
    },
  };

  const activeJobData = [
    {
      category: data.rankOneByCategory?.category ?? "",
      jobs: data.rankOneByCategory?.totalJobs,
    },
    {
      category: data.rankTwoByCategory?.category ?? "",
      jobs: data.rankTwoByCategory?.totalJobs,
    },
    {
      category: data.rankThreeByCategory?.category ?? "",
      jobs: data.rankThreeByCategory?.totalJobs,
    },
    {
      category: data.rankFourByCategory?.category ?? "",
      jobs: data.rankFourByCategory?.totalJobs,
    },
  ];

  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border max-h-[500px]">
      <div className="w-full flex items-center justify-between mb-3">
        <span className="text-primary font-semibold text-[18px]">
          Active Tasks
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
      <AppPieChart
        dataKey="jobs"
        chartData={activeJobData}
        config={config}
        nameKey="category"
      />
      <CompletedJobs className="mt-5" config={config} data={data} />
    </div>
  );
}

export default ActiveJobs;
