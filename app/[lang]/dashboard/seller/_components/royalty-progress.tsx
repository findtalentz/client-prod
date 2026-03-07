"use client";
import RoyaltyProgressShared from "@/components/dashboard/royalty-progress";

function RoyaltyProgress() {
  return (
    <RoyaltyProgressShared
      role="seller"
      detailsHref="/dashboard/seller/royalty-program"
      className="shadow !px-6 py-5 !rounded-3xl !overflow-hidden border relative"
    />
  );
}

export default RoyaltyProgress;
