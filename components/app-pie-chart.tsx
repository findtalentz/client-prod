"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
}

export function AppPieChart({ config, chartData, dataKey, nameKey }: Props) {
  const total = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => acc + ((curr[dataKey] as number) ?? 0),
      0
    );
  }, [chartData, dataKey]);

  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[200px]"
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
          innerRadius={55}
          strokeWidth={5}
          paddingAngle={3}
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy ? viewBox.cy + 24 : 24}
                      className="fill-muted-foreground"
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
