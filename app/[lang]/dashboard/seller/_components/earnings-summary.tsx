"use client";

import useTotalEarnings from "@/hooks/useTotalEarning";
import usePendingEarnings from "@/hooks/usePendingEarnings";
import { DollarSign, Clock } from "lucide-react";

export default function EarningsSummary() {
  const { data: totalEarnings } = useTotalEarnings();
  const { data: pendingEarnings } = usePendingEarnings();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="shadow p-4 rounded-3xl overflow-hidden border bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Total Earned</span>
          <DollarSign className="w-4 h-4 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold">
          ${totalEarnings?.data?.toFixed(2) || "0.00"}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
      </div>

      <div className="shadow p-4 rounded-3xl overflow-hidden border bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Upcoming</span>
          <Clock className="w-4 h-4 text-orange-500" />
        </div>
        <h3 className="text-2xl font-bold">
          ${pendingEarnings?.data?.toFixed(2) || "0.00"}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Pending clearance</p>
      </div>
    </div>
  );
}
