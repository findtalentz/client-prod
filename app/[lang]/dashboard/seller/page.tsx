import { LineChartData } from "@/components/app-line-chart";
import { Calendar } from "@/components/calender";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import ApiResponse from "@/schemas/ApiRespose";
import SalseReport from "@/schemas/SalseReport";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";
import ActiveJobs from "./_components/active-jobs";
import MonthlyEarnings from "./_components/monthly-earnings";
import MyBalance from "./_components/my-balance";
import RoyaltyProgress from "./_components/royalty-progress";
import ViewsChart from "./_components/views-chart";

export const dynamic = "force-dynamic";

async function SellerDashboard() {
  const [{ data }, response, { data: chartData }] = await Promise.all([
    apiClient.get<ApiResponse<ActiveJobReport>>("/seller/active-jobs-report"),
    apiClient.get<ApiResponse<SalseReport>>("/seller/monthly-earnings"),
    apiClient.get<ApiResponse<LineChartData[]>>("/views/data", {
      params: { type: "Profile", numberOfMonth: 6 },
    }),
  ]);

  return (
    <div>
      <h2 className="mb-2 text-primary">Dashboard</h2>
      <Grid columns={{ initial: "1", lg: "1fr 400px" }} gap="5">
        <div className="space-y-6">
          <MonthlyEarnings report={response.data.data} />
          <ViewsChart data={chartData.data} />
          <RoyaltyProgress />
        </div>
        <div className="space-y-6">
          <MyBalance />
          <Calendar />
          <ActiveJobs data={data.data} />
        </div>
      </Grid>
    </div>
  );
}

export default SellerDashboard;
