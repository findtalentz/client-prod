"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart with text";

const chartData = [
  { browser: "Design & Creative", jobCount: 4, fill: "#28C3AB" },
  { browser: "Development & IT", jobCount: 2, fill: "#39F3BB" },
  { browser: "AI Services", jobCount: 3, fill: "#1A9395" },
  { browser: "Salse & Marketing", jobCount: 3, fill: "#E2F397" },
];

const chartConfig = {
  chrome: {
    label: "Design & Creative",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Development & IT",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "AI Services",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Salse & Marketing",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const JobChart = () => {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.jobCount, 0);
  }, []);

  return (
    <div className="flex flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="jobCount"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};

export default JobChart;
