"use client";
import useSession from "@/hooks/useSession";
import { Slider } from "@radix-ui/themes";
import Link from "next/link";

function RoyaltyProgress() {
  const { data } = useSession();
  if (!data) return null;

  const seller_percent = (data?.data.totalEarning / 1000) * 100;

  const setPercentage = seller_percent > 100 ? 100 : Math.round(seller_percent);

  return (
    <div className="shadow !px-6 py-5 !rounded-3xl !overflow-hidden border relative">
      <Link
        href="/dashboard/seller/royalty-program"
        className="text-primary underline absolute top-4 right-4 font-[500]"
      >
        View Details
      </Link>
      <span className="text-primary font-semibold text-[18px]">
        Royalty Progress
      </span>

      <div className="space-y-2">
        <p className="!text-sm !text-gray-400">Upgrade to Task Achiever</p>
        <div className="space-y-1">
          <p>by Sign Up and Complete the first task</p>
          <Slider
            defaultValue={[setPercentage]}
            max={100}
            color="cyan"
            style={{ pointerEvents: "none", opacity: 1 }}
          />
        </div>
        <p className="text-primary">{setPercentage}% completed</p>
      </div>
    </div>
  );
}

export default RoyaltyProgress;
