"use client";
import { buttonVariants } from "@/components/ui/button";
import useDictionary from "@/hooks/useDictionary";
import usePendingEarnings from "@/hooks/usePendingEarnings";
import useSession from "@/hooks/useSession";
import { Clock } from "lucide-react";
import Link from "next/link";

function MyBalance() {
  const dict = useDictionary();
  const { data: session } = useSession();
  const { data: pendingEarnings } = usePendingEarnings();
  if (!session) return null;
  return (
    <div className="shadow p-6 rounded-3xl overflow-hidden border">
      <div className="flex items-center justify-between">
        <span className="text-primary font-semibold text-[18px]">
          {dict.seller.myBalance}
        </span>
        <Link
          href="/dashboard/seller/earnings"
          className={buttonVariants({ variant: "link" })}
        >
          {dict.seller.viewWallet}
        </Link>
      </div>
      <h3> ${session.data.balance > 1 ? session.data.balance : "0.0"} </h3>
      {pendingEarnings?.data ? (
        <div className="flex items-center gap-1.5 mt-2 text-sm text-orange-500">
          <Clock className="w-3.5 h-3.5" />
          <span>${pendingEarnings.data.toFixed(2)} {dict.seller.pendingClearance}</span>
        </div>
      ) : null}
    </div>
  );
}

export default MyBalance;
