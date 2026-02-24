"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartDataItem {
  [key: string]: string | number;
}

interface Props {
  config: ChartConfig;
  chartData: ChartDataItem[];
  dataKey: string;
  nameKey: string;
  className?: string;
}

export function AppPieChart({
  config,
  chartData,
  dataKey,
  nameKey,
  className,
}: Props) {
  const total = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => acc + ((curr[dataKey] as number) ?? 0),
      0
    );
  }, [chartData, dataKey]);

  return (
    <ChartContainer
      config={config}
      className={cn(
        "mx-auto aspect-square w-full max-w-[220px] sm:max-w-[250px]",
        className
      )}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius="55%"
          outerRadius="85%"
          strokeWidth={3}
          paddingAngle={3}
          stroke="transparent"
        >
          {chartData.map((entry, index) => {
            const key = entry[nameKey] as string;
            const color = config[key]?.color || "#8884d8";
            return <Cell key={key + index} fill={color} />;
          })}
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
                      className="fill-foreground text-2xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy ? viewBox.cy + 22 : 22}
                      className="fill-muted-foreground text-xs"
                    >
                      Total
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
