import { AppBarChart } from "@/components/app-bar-chart";
import SalseReport from "@/schemas/SalseReport";

interface Props {
  report: SalseReport;
}

const monthlyConfig = {
  earnings: {
    label: "Monthly Earnings",
    color: "var(--color-primary)",
  },
};

export default function MonthlyEarnings({ report }: Props) {
  return (
    <div className="shadow !p-6 !rounded-3xl !overflow-hidden border">
      <div className="w-full flex items-center justify-between pb-6">
        <span className="text-primary font-semibold text-[18px]">
          Monthly Earnings
        </span>
      </div>
      <AppBarChart
        data={report.chartData}
        config={monthlyConfig}
        xAxisKey="month"
        barKeys={["earnings"]}
      />
    </div>
  );
}
