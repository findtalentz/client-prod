"use client";

import { AppAreaChart, ChartData } from "@/components/app-area-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: ChartData[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#189294",
  },
  transactions: {
    label: "Transactions",
    color: "#2dd4bf",
  },
};

export default function RevenueChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <AppAreaChart data={data} config={chartConfig} xKey="month" />
      </CardContent>
    </Card>
  );
}
