"use client";
import ActiveJobsShared from "@/components/dashboard/active-jobs";

function ActiveJobs() {
  return <ActiveJobsShared endpoint="/buyer/active-jobs-report" title="Active Jobs" layout="horizontal" />;
}

export default ActiveJobs;
