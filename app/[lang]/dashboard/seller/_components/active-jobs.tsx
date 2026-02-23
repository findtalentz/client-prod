"use client";
import ActiveJobsShared from "@/components/dashboard/active-jobs";
import ActiveJobReport from "@/schemas/ActiveJobReport";

interface Props {
  data: ActiveJobReport;
}

function ActiveJobs({ data }: Props) {
  return <ActiveJobsShared data={data} title="Active Tasks" layout="vertical" />;
}

export default ActiveJobs;
