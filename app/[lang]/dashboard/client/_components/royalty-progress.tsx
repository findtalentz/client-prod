"use client";
import useSession from "@/hooks/useSession";
import { Flex, Slider } from "@radix-ui/themes";
import Link from "next/link";

function RoyaltyProgress() {
  const { data } = useSession();
  if (!data) return null;

  const client_percent = (data?.data.totalSpend / 1000) * 100;

  const percentage = client_percent > 100 ? 100 : Math.round(client_percent);

  return (
    <div className="p-3 border rounded-3xl bg-white relative">
      <Link
        href="/dashboard/buyer/royalty-program"
        className="text-primary underline absolute top-4 right-4 font-[500]"
      >
        View Details
      </Link>
      <Flex align="center" justify="between" mb="2">
        <span className="text-primary font-semibold text-[18px]">
          Royalty Progress
        </span>
      </Flex>
      <div className="space-y-2">
        <p className="!text-sm !text-gray-400">Upgrade to Task Achiever</p>
        <div className="space-y-1">
          <p>by Sign Up and Complete the first task</p>
          <Slider
            defaultValue={[percentage]}
            max={100}
            color="cyan"
            style={{ pointerEvents: "none", opacity: 1 }}
          />
        </div>
        <p className="text-primary">{percentage}% completed</p>
      </div>
    </div>
  );
}

export default RoyaltyProgress;
