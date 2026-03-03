import { Calendar } from "@/components/calender";
import { Grid } from "@radix-ui/themes";
import ActiveJobs from "./_components/active-jobs";
import MonthlyEarnings from "./_components/monthly-earnings";
import MyBalance from "./_components/my-balance";
import RoyaltyProgress from "./_components/royalty-progress";
import ViewsChart from "./_components/views-chart";

export const dynamic = "force-dynamic";

async function SellerDashboard() {
  return (
    <div>
      <h2 className="mb-2 text-primary">Dashboard</h2>
      <Grid columns={{ initial: "1", lg: "1fr 400px" }} gap="5">
        <div className="space-y-6">
          <MonthlyEarnings />
          <ViewsChart />
          <RoyaltyProgress />
        </div>
        <div className="space-y-6">
          <MyBalance />
          <Calendar />
          <ActiveJobs />
        </div>
      </Grid>
    </div>
  );
}

export default SellerDashboard;
