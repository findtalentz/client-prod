"use client";

import { AppPieChart } from "@/components/app-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  activeJobs: number;
  completedJobs: number;
  totalJobs: number;
}

const chartConfig = {
  OPEN: {
    label: "Open",
    color: "#2dd4bf",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#189294",
  },
  COMPLETED: {
    label: "Completed",
    color: "#0f766e",
  },
};

export default function JobDistributionChart({
  activeJobs,
  completedJobs,
  totalJobs,
}: Props) {
  const openJobs = totalJobs - activeJobs - completedJobs;

  const chartData = [
    { status: "OPEN", count: openJobs > 0 ? openJobs : 0 },
    { status: "IN_PROGRESS", count: activeJobs },
    { status: "COMPLETED", count: completedJobs },
  ];

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Job Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <AppPieChart
          config={chartConfig}
          chartData={chartData}
          dataKey="count"
          nameKey="status"
        />
      </CardContent>
    </Card>
  );
}
