"use client";
import { AppPieChart } from "@/components/app-pie-chart";
import TimeRangeToggle from "@/components/time-range-toggle";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CompletedJobs from "./completed-jobs";

interface Props {
  endpoint: string;
  title?: string;
  layout?: "horizontal" | "vertical";
  className?: string;
}

function ActiveJobs({
  endpoint,
  title = "Active Jobs",
  layout = "horizontal",
  className,
}: Props) {
  const [timeRange, setTimeRange] = useState("month");

  const { data: response } = useQuery<ApiResponse<ActiveJobReport>>({
    queryKey: ["active_jobs_report", endpoint, timeRange],
    queryFn: () =>
      apiClient
        .get<ApiResponse<ActiveJobReport>>(endpoint, {
          params: { timeRange },
        })
        .then((r) => r.data),
  });

  const data = response?.data;

  if (!data) return null;

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
          "shadow p-4 sm:p-6 rounded-3xl overflow-hidden border"
        }
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-primary font-semibold text-lg">
            {title}
          </span>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>
        <AppPieChart
          dataKey="jobs"
          chartData={activeJobData}
          config={config}
          nameKey="category"
        />
        <CompletedJobs className="mt-4" config={config} data={data} />
      </div>
    );
  }

  return (
    <div
      className={className ?? "shadow rounded-3xl overflow-hidden border"}
    >
      <div className="flex items-center justify-between p-4 sm:p-5">
        <span className="text-primary font-semibold text-lg">{title}</span>
        <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 px-4 pb-4 sm:pb-5">
        <div className="w-full sm:w-2/5 flex-shrink-0">
          <AppPieChart
            config={config}
            chartData={activeJobData}
            dataKey="jobs"
            nameKey="category"
          />
        </div>
        <div className="w-full sm:w-3/5">
          <CompletedJobs data={data} config={config} />
        </div>
      </div>
    </div>
  );
}

export default ActiveJobs;
