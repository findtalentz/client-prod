import { Calendar } from "@/components/calender";
import { buttonVariants } from "@/components/ui/button";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import ApiResponse from "@/schemas/ApiRespose";
import SpendReport from "@/schemas/SpendReport";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";
import Link from "next/link";
import ActiveJobs from "./_components/active-jobs";
import NewApplications from "./_components/new-applications";
import NewActions from "./_components/request-actions";
import RoyaltyProgress from "./_components/royalty-progress";
import SpendChart from "./_components/spend-chart";

export const dynamic = "force-dynamic";

async function BuyerDashboard() {
  const [totalSpend, activeJobsReport] = await Promise.all([
    apiClient.get<ApiResponse<SpendReport>>("/buyer/spend-report"),
    apiClient.get<ApiResponse<ActiveJobReport>>("/buyer/active-jobs-report"),
  ]);

  return (
    <div className="md:p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
        <Link className={buttonVariants()} href="/dashboard/client/jobs/new">
          Post New Job Ads
        </Link>
      </div>

      <Grid columns={{ initial: "1", lg: "3" }} gap="6">
        <NewApplications />
        <NewActions />
        <Calendar />
      </Grid>
      <Grid columns={{ initial: "1", lg: "600px 1fr" }} gap="6">
        <div className="space-y-6">
          <ActiveJobs data={activeJobsReport.data.data} />
          <RoyaltyProgress />
        </div>
        <div>
          <SpendChart data={totalSpend.data.data} />
        </div>
      </Grid>
    </div>
  );
}

export default BuyerDashboard;
