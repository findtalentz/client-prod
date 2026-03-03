"use client";
import ActiveJobsShared from "@/components/dashboard/active-jobs";

function ActiveJobs() {
  return <ActiveJobsShared endpoint="/seller/active-jobs-report" title="Active Tasks" layout="vertical" />;
}

export default ActiveJobs;
