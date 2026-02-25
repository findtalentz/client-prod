"use client";
import RoyaltyProgressShared from "@/components/dashboard/royalty-progress";

function RoyaltyProgress() {
  return (
    <RoyaltyProgressShared
      metricField="totalSpend"
      detailsHref="/dashboard/client/royalty-program"
    />
  );
}

export default RoyaltyProgress;
