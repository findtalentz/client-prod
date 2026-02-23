"use client";
import ActiveJobsShared from "@/components/dashboard/active-jobs";
import ActiveJobReport from "@/schemas/ActiveJobReport";

interface Props {
  data: ActiveJobReport;
}

function ActiveJobs({ data }: Props) {
  return <ActiveJobsShared data={data} title="Active Jobs" layout="horizontal" />;
}

export default ActiveJobs;
