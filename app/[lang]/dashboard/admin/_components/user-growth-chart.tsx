"use client";

import { AppBarChart, BarChartData } from "@/components/app-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: BarChartData[];
}

const chartConfig = {
  clients: {
    label: "Clients",
    color: "#2dd4bf",
  },
  sellers: {
    label: "Sellers",
    color: "#189294",
  },
};

export default function UserGrowthChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <AppBarChart
          data={data}
          config={chartConfig}
          xAxisKey="month"
          barKeys={["clients", "sellers"]}
        />
      </CardContent>
    </Card>
  );
}
