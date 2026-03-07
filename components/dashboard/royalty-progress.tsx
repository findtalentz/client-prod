"use client";
import apiClient from "@/services/api-client";
import ApiResponse from "@/schemas/ApiRespose";
import Royalty from "@/schemas/Royalty";
import { cn } from "@/lib/utils";
import { Slider } from "@radix-ui/themes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface Props {
  role: "seller" | "client";
  detailsHref: string;
  className?: string;
}

const TIER_IMAGES: Record<string, string> = {
  Newcomer: "/royalty/welcome.png",
  "Task Achiever": "/royalty/task.png",
  Pro: "/royalty/pro.png",
  Expert: "/royalty/expert.png",
  Master: "/royalty/master.png",
};

const TIER_COLORS: Record<string, string> = {
  None: "text-gray-400",
  Newcomer: "text-[#9CA3AF]",
  "Task Achiever": "text-[#6B9CC9]",
  Pro: "text-[#D2AF65]",
  Expert: "text-[#EF4045]",
  Master: "text-[#2D2D2D]",
};

function RoyaltyProgress({ role, detailsHref, className }: Props) {
  const params = useParams();
  const lang = params?.lang || "en";

  const { data: royalty } = useQuery({
    queryKey: ["royalty", role],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Royalty>>(
        `/royalty/${role}`
      );
      return data.data;
    },
  });

  if (!royalty) return null;

  const currentTierName = royalty.currentTierName;
  const nextTierName = royalty.nextTierName;
  const progress = royalty.nextTierProgress;
  const tierImage = TIER_IMAGES[currentTierName] || "/royalty/welcome.png";

  return (
    <div
      className={cn(
        "p-3 border rounded-3xl bg-white relative",
        className
      )}
    >
      <Link
        href={`/${lang}${detailsHref}`}
        className="text-primary underline absolute top-4 right-4 font-[500]"
      >
        View Details
      </Link>
      <span className="text-primary font-semibold text-[18px]">
        Royalty Progress
      </span>

      <div className="space-y-3 mt-2">
        <div className="flex items-center gap-3">
          {currentTierName !== "None" && (
            <Image
              src={tierImage}
              width={40}
              height={40}
              alt={currentTierName}
            />
          )}
          <div>
            <p className="text-xs text-gray-400">Current Tier</p>
            <p
              className={cn(
                "font-semibold",
                TIER_COLORS[currentTierName] || "text-gray-400"
              )}
            >
              {currentTierName === "None" ? "No Tier Yet" : currentTierName}
            </p>
          </div>
        </div>

        {nextTierName ? (
          <div className="space-y-1">
            <p className="!text-sm !text-gray-400">
              Upgrade to {nextTierName}
            </p>
            <Slider
              defaultValue={[progress]}
              max={100}
              color="cyan"
              style={{ pointerEvents: "none", opacity: 1 }}
            />
            <p className="text-primary text-sm">{progress}% completed</p>
          </div>
        ) : (
          <p className="text-sm text-green-600 font-medium">
            You have reached the highest tier!
          </p>
        )}
      </div>
    </div>
  );
}

export default RoyaltyProgress;
