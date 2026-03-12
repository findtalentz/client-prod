"use client";
import ActiveJobsShared from "@/components/dashboard/active-jobs";
import useDictionary from "@/hooks/useDictionary";

function ActiveJobs() {
  const dict = useDictionary();
  return <ActiveJobsShared endpoint="/buyer/active-jobs-report" title={dict.common?.activeJobs || "Active Jobs"} layout="horizontal" />;
}

export default ActiveJobs;
