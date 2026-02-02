"use client";
import { AppPieChart } from "@/components/app-pie-chart";
import { cn } from "@/lib/utils";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import { Flex } from "@radix-ui/themes";
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
      jobs: data.rankOneByCategory?.totalJobs ?? "",
    },
    {
      category: data.rankTwoByCategory?.category,
      jobs: data.rankTwoByCategory?.totalJobs ?? "",
    },
    {
      category: data.rankThreeByCategory?.category ?? "",
      jobs: data.rankThreeByCategory?.totalJobs ?? "",
    },
    {
      category: data.rankFourByCategory?.category ?? "",
      jobs: data.rankFourByCategory?.totalJobs ?? "",
    },
  ];

  return (
    <div className="shadow !rounded-3xl !overflow-hidden border">
      <div className="w-full flex p-5 items-center justify-between">
        <span className="text-primary font-semibold text-[18px]">
          Active Jobs
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
      <Flex align="center" justify="between" pr="2">
        <div className="flex-2">
          <AppPieChart
            config={config}
            chartData={activeJobData}
            dataKey="jobs"
            nameKey="category"
          />
        </div>
        <div className="flex-3">
          <CompletedJobs
            data={data}
            config={config}
            className="h-[300px] px-4 lg:px-0"
          />
        </div>
      </Flex>
    </div>
  );
}

export default ActiveJobs;
