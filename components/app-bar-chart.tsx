"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

export interface BarChartData {
  [key: string]: string | number;
}

export interface BarChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface AppBarChartProps {
  data: BarChartData[];
  config: BarChartConfig;
  className?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  barRadius?: number;
  xAxisKey: string;
  barKeys: string[];
}

export function AppBarChart({
  data,
  config,
  className,
  showGrid = true,
  showLabels = true,
  barRadius = 8,
  xAxisKey = "month",
  barKeys = ["desktop"],
}: AppBarChartProps) {
  return (
    <ChartContainer
      config={config}
      className={cn(
        "aspect-auto h-[200px] sm:h-[250px] lg:h-[300px] w-full",
        className
      )}
    >
      <BarChart
        data={data}
        margin={{
          top: showLabels ? 30 : 10,
          right: 10,
          left: -10,
          bottom: 0,
        }}
      >
        {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => String(value).slice(0, 3)}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={12}
          width={50}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {barKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={config[key]?.color || "var(--color-primary)"}
            radius={barRadius}
          >
            {showLabels && (
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}
