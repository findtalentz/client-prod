"use client";

import { Calendar } from "@/components/calender";
import useDictionary from "@/hooks/useDictionary";
import { Grid } from "@radix-ui/themes";
import ActiveJobs from "./_components/active-jobs";
import EarningsSummary from "./_components/earnings-summary";
import MonthlyEarnings from "./_components/monthly-earnings";
import MyBalance from "./_components/my-balance";
import RoyaltyProgress from "./_components/royalty-progress";
import ViewsChart from "./_components/views-chart";

export const dynamic = "force-dynamic";

function SellerDashboard() {
  const dict = useDictionary();
  return (
    <div>
      <h2 className="mb-2 text-primary">{dict.common.dashboard}</h2>
      <Grid columns={{ initial: "1", lg: "1fr 400px" }} gap="5">
        <div className="space-y-6">
          <EarningsSummary />
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
