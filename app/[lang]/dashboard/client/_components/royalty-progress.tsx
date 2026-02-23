"use client";
import RoyaltyProgressShared from "@/components/dashboard/royalty-progress";

function RoyaltyProgress() {
  return (
    <RoyaltyProgressShared
      metricField="totalSpend"
      detailsHref="/dashboard/buyer/royalty-program"
    />
  );
}

export default RoyaltyProgress;
