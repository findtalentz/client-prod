"use client";
import { AppPieChart } from "@/components/app-pie-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import CompletedJobs from "./completed-jobs";

interface Props {
  data: ActiveJobReport;
  title?: string;
  layout?: "horizontal" | "vertical";
  className?: string;
}

function ActiveJobs({
  data,
  title = "Active Jobs",
  layout = "horizontal",
  className,
}: Props) {
  const [currentTask, setCurrentTask] = useState("month");

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
      category: data.rankTwoByCategory?.category ?? "",
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

  if (layout === "vertical") {
    return (
      <div
        className={
          className ??
          "shadow !p-6 !rounded-3xl !overflow-hidden border max-h-[500px]"
        }
      >
        <div className="w-full flex items-center justify-between mb-3">
          <span className="text-primary font-semibold text-[18px]">
            {title}
          </span>
          <TimeRangeToggle value={currentTask} onChange={setCurrentTask} />
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

  return (
    <div
      className={className ?? "shadow !rounded-3xl !overflow-hidden border"}
    >
      <div className="w-full flex p-5 items-center justify-between">
        <span className="text-primary font-semibold text-[18px]">{title}</span>
        <TimeRangeToggle value={currentTask} onChange={setCurrentTask} />
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
