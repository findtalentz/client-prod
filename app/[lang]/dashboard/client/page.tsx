import { Calendar } from "@/components/calender";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ActiveJobs from "./_components/active-jobs";
import NewApplications from "./_components/new-applications";
import NewActions from "./_components/request-actions";
import RoyaltyProgress from "./_components/royalty-progress";
import SpendChart from "./_components/spend-chart";
import { getDictionary } from "../../dictionaries";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: "en" | "ch" }>;
}

async function BuyerDashboard({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.dashboard;

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">{t.common.dashboard}</h2>
        <Link className={buttonVariants()} href={`/${lang}/dashboard/client/jobs/new`}>
          {t.client.postNewJobAds}
        </Link>
      </div>

      {/* Top row: Applications, Actions, Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewApplications lang={lang} />
        <NewActions lang={lang} />
        <Calendar />
      </div>

      {/* Bottom row: Active Jobs + Royalty | Spend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div className="space-y-6">
          <ActiveJobs />
          <RoyaltyProgress />
        </div>
        <SpendChart />
      </div>
    </div>
  );
}

export default BuyerDashboard;
