"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export interface ChartData {
  [key: string]: string | number;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface Props {
  data: ChartData[];
  config: ChartConfig;
  xKey: string;
  className?: string;
}

export function AppAreaChart({ data, config, xKey, className }: Props) {
  return (
    <ChartContainer config={config} className={className ?? "h-[300px] w-full"}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => String(value).slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />

        {/* Define gradients for each series */}
        <defs>
          {Object.keys(config).map((key) => (
            <linearGradient
              id={`gradient-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              key={key}
            >
              <stop
                offset="5%"
                stopColor={config[key].color}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={config[key].color}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>

        {/* Render chart areas with gradients */}
        {Object.keys(config).map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="natural"
            stroke={config[key].color}
            fill={`url(#gradient-${key})`}
            strokeWidth={2}
            stackId="a"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
