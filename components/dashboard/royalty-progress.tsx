"use client";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { Slider } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  metricField: "totalSpend" | "totalEarning";
  detailsHref: string;
  className?: string;
}

function RoyaltyProgress({ metricField, detailsHref, className }: Props) {
  const { data } = useSession();
  if (!data) return null;

  const rawPercent = (data.data[metricField] / 1000) * 100;
  const percentage = rawPercent > 100 ? 100 : Math.round(rawPercent);

  return (
    <div
      className={cn(
        "p-3 border rounded-3xl bg-white relative",
        className
      )}
    >
      <Link
        href={detailsHref}
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
