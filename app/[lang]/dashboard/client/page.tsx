import { Calendar } from "@/components/calender";
import { buttonVariants } from "@/components/ui/button";
import ActiveJobReport from "@/schemas/ActiveJobReport";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import Link from "next/link";
import ActiveJobs from "./_components/active-jobs";
import NewApplications from "./_components/new-applications";
import NewActions from "./_components/request-actions";
import RoyaltyProgress from "./_components/royalty-progress";
import SpendChart from "./_components/spend-chart";

export const dynamic = "force-dynamic";

async function BuyerDashboard() {
  const [activeJobsReport] = await Promise.all([
    apiClient.get<ApiResponse<ActiveJobReport>>("/buyer/active-jobs-report"),
  ]);

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
        <Link className={buttonVariants()} href="/dashboard/client/jobs/new">
          Post New Job Ads
        </Link>
      </div>

      {/* Top row: Applications, Actions, Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewApplications />
        <NewActions />
        <Calendar />
      </div>

      {/* Bottom row: Active Jobs + Royalty | Spend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div className="space-y-6">
          <ActiveJobs data={activeJobsReport.data.data} />
          <RoyaltyProgress />
        </div>
        <SpendChart />
      </div>
    </div>
  );
}

export default BuyerDashboard;
