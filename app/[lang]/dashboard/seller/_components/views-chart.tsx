import { AppLineChart, LineChartData } from "@/components/app-line-chart";

interface Props {
  data: LineChartData[];
}

export default function ViewsChart({ data }: Props) {
  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Number of Views
        </span>
      </div>
      <AppLineChart
        config={{
          views: {
            label: "Views",
            color: "var(--primary)",
          },
        }}
        data={data}
      />
    </div>
  );
}
