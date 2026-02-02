"use client";
import { buttonVariants } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import Link from "next/link";

function MyBalance() {
  const { data: session } = useSession();
  if (!session) return null;
  return (
    <div className="shadow p-6 rounded-3xl overflow-hidden border">
      <div className="flex items-center justify-between">
        <span className="text-primary font-semibold text-[18px]">
          My Balance
        </span>
        <Link
          href="/dashboard/seller/earnings"
          className={buttonVariants({ variant: "link" })}
        >
          View Wallet
        </Link>
      </div>
      <h3> ${session.data.balance > 1 ? session.data.balance : "0.0"} </h3>
    </div>
  );
}

export default MyBalance;
