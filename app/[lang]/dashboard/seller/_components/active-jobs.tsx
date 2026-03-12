"use client";
import ActiveJobsShared from "@/components/dashboard/active-jobs";
import useDictionary from "@/hooks/useDictionary";

function ActiveJobs() {
  const dict = useDictionary();
  return <ActiveJobsShared endpoint="/seller/active-jobs-report" title={dict.common?.activeTasks || "Active Tasks"} layout="vertical" />;
}

export default ActiveJobs;
