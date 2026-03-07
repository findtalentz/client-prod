import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Grid } from "@radix-ui/themes";
import Image from "next/image";
import { FaCheck, FaLock } from "react-icons/fa";

type CardType = "Welcome" | "Task" | "Pro" | "Expert" | "Master";

const cardColorMap: Record<CardType, string> = {
  Welcome: "bg-[#D5D7D9]",
  Task: "bg-[#A3BFDB]",
  Pro: "bg-[#D2AF65]",
  Expert: "bg-[#EF4045]",
  Master: "bg-[#2D2D2D]",
};

const cardTitleMap: Record<CardType, string> = {
  Welcome: "Newcomer",
  Task: "Task Achiever",
  Pro: "Pro Freelancer",
  Expert: "Expert Contributor",
  Master: "Master Freelancer",
};

const cardLogoMap: Record<CardType, string> = {
  Welcome: "/royalty/welcome.png",
  Task: "/royalty/task.png",
  Pro: "/royalty/pro.png",
  Expert: "/royalty/expert.png",
  Master: "/royalty/master.png",
};

const cardRequirementsMap: Record<CardType, string[]> = {
  Welcome: [
    "Complete at least 1 job",
    "Get at least 1 review",
    "Maintain 4.5+ star rating",
    "Earn minimum $200",
  ],
  Task: [
    "Complete at least 5 jobs",
    "Get at least 5 reviews",
    "Maintain 4.5+ star rating",
    "Earn minimum $400",
  ],
  Pro: [
    "Complete at least 10 jobs",
    "Get at least 10 reviews",
    "Maintain 4.5+ star rating",
    "Earn minimum $1,000",
  ],
  Expert: [
    "Complete at least 15 jobs",
    "Get at least 15 reviews",
    "Maintain 4.5+ star rating",
    "Earn minimum $2,500",
  ],
  Master: [
    "Complete at least 30 jobs",
    "Get at least 30 reviews",
    "Maintain 4.5+ star rating",
    "Earn minimum $20,000",
  ],
};

const cardBenefitsMap: Record<CardType, string[]> = {
  Welcome: ["Profile badge", "Access to basic job listings"],
  Task: [
    "Task Achiever badge",
    "Priority in search results",
    "Access to premium job listings",
  ],
  Pro: [
    "Pro badge",
    "Higher visibility to clients",
    "Reduced service fees",
    "Featured profile placement",
  ],
  Expert: [
    "Expert badge",
    "Top search ranking",
    "Lowest service fees",
    "Priority customer support",
    "Exclusive job invitations",
  ],
  Master: [
    "Master badge",
    "Highest search priority",
    "Minimum service fees",
    "Dedicated account manager",
    "VIP customer support",
    "Early access to new features",
  ],
};

interface Props {
  type: CardType;
  step: number;
  tierIndex: number;
  currentTier: number;
  metrics?: {
    completedJobs?: number;
    reviewCount?: number;
    averageRating?: number;
    totalEarning?: number;
  };
}

const RoyaltyCard = ({ type, step, tierIndex, currentTier, metrics }: Props) => {
  const isCompleted = step >= 100;
  const isCurrent = tierIndex === currentTier; // next tier to unlock
  const isLocked = tierIndex > currentTier;

  return (
    <Grid columns={{ initial: "1", md: "400px 1fr" }} gap="5">
      <div
        className={cn(
          "rounded-xl overflow-hidden relative",
          isLocked && "opacity-60"
        )}
      >
        <Image
          src={cardLogoMap[type]}
          width={80}
          height={80}
          alt="logo"
          className="absolute top-0 right-0"
        />
        <div className={cn(cardColorMap[type], "p-4 space-y-4")}>
          <div className="flex items-center gap-2">
            <h3 className="text-white">{cardTitleMap[type]}</h3>
            {isCompleted && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Unlocked
              </span>
            )}
            {isLocked && (
              <FaLock className="text-white/70 text-sm" />
            )}
          </div>
          <div className="text-white space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Requirements
            </p>
            {cardRequirementsMap[type].map((item, key) => (
              <Grid columns={"16px 1fr"} gap="2" key={key} className="text-sm">
                <div
                  className={cn(
                    "w-4 h-4 flex items-center justify-center rounded-full mt-0.5",
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-400"
                  )}
                >
                  <FaCheck className="text-[8px]" />
                </div>
                <span>{item}</span>
              </Grid>
            ))}
          </div>
        </div>
        <div className="p-3 bg-[#F4F4F5] space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Benefits
          </p>
          {cardBenefitsMap[type].map((benefit, key) => (
            <div key={key} className="flex items-center gap-1.5 text-sm text-gray-600">
              <span className="text-primary text-xs">*</span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 flex flex-col justify-center">
        {isCompleted ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
              <p className="font-semibold text-green-600">Tier Completed!</p>
            </div>
            <Slider draggable={false} max={100} value={[100]} />
            <p className="text-sm font-medium text-green-600">100% Completed</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-medium">
              {isCurrent ? (
                <span className="text-primary">Your next milestone</span>
              ) : (
                <span className="text-gray-400">
                  Complete previous tiers first
                </span>
              )}
            </p>
            <div className="space-y-2">
              <Slider draggable={false} max={100} value={[step]} />
              <p className="text-sm font-medium text-primary">
                {step}% Completed
              </p>
            </div>

            {isCurrent && metrics && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                <p className="font-medium text-gray-700">Your Progress</p>
                <p className="text-gray-500">
                  Jobs completed:{" "}
                  <span className="font-medium text-gray-700">
                    {metrics.completedJobs ?? 0}
                  </span>
                </p>
                <p className="text-gray-500">
                  Reviews:{" "}
                  <span className="font-medium text-gray-700">
                    {metrics.reviewCount ?? 0}
                  </span>
                </p>
                <p className="text-gray-500">
                  Average rating:{" "}
                  <span className="font-medium text-gray-700">
                    {metrics.averageRating ?? 0} / 5.0
                  </span>
                </p>
                <p className="text-gray-500">
                  Total earnings:{" "}
                  <span className="font-medium text-gray-700">
                    ${metrics.totalEarning ?? 0}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Grid>
  );
};

export default RoyaltyCard;
