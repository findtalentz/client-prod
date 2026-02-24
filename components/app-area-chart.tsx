"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
    <ChartContainer
      config={config}
      className={cn("aspect-auto h-[200px] sm:h-[250px] lg:h-[300px] w-full", className)}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
          tickFormatter={(value) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />

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
                stopOpacity={0.05}
              />
            </linearGradient>
          ))}
        </defs>

        {Object.keys(config).map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
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
