"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export interface LineChartData {
  [key: string]: string | number;
}

interface Props {
  config: ChartConfig;
  data: LineChartData[];
  xKey?: string;
  dataKeys?: string[];
  className?: string;
}

export function AppLineChart({
  config,
  data,
  xKey = "month",
  dataKeys,
  className,
}: Props) {
  const keys = dataKeys ?? Object.keys(config);

  return (
    <ChartContainer
      config={config}
      className={cn(
        "aspect-auto h-[200px] sm:h-[250px] lg:h-[300px] w-full",
        className
      )}
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: -10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
          content={<ChartTooltipContent indicator="line" />}
        />
        {keys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={config[key]?.color || "var(--color-primary)"}
            strokeWidth={2}
            dot={{
              fill: config[key]?.color || "var(--color-primary)",
              r: 3,
            }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
