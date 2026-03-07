"use client";
import apiClient from "@/services/api-client";
import RoyaltyCard from "./_components/royalty-card";
import ApiResponse from "@/schemas/ApiRespose";
import Royalty from "@/schemas/Royalty";
import { useQuery } from "@tanstack/react-query";
import RoyaltyCardSkeleton from "@/components/skeletons/royalty-card-skeleton";

const RoyaltyProgram = () => {
  const { data: royalty, isLoading } = useQuery({
    queryKey: ["royalty", "seller"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Royalty>>(
        "/royalty/seller"
      );
      return data.data;
    },
  });

  if (isLoading || !royalty) return <RoyaltyCardSkeleton />;

  const steps = [
    { type: "Welcome" as const, step: royalty.step1 },
    { type: "Task" as const, step: royalty.step2 },
    { type: "Pro" as const, step: royalty.step3 },
    { type: "Expert" as const, step: royalty.step4 },
    { type: "Master" as const, step: royalty.step5 },
  ];

  return (
    <div>
      <h2 className="mb-2 text-primary-dark">Royalty Program</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Complete milestones to unlock higher tiers and earn rewards.
        {royalty.currentTierName !== "None" && (
          <span className="ml-1 font-medium text-primary">
            Current tier: {royalty.currentTierName}
          </span>
        )}
      </p>
      <div className="space-y-6">
        {steps.map(({ type, step }, index) => (
          <RoyaltyCard
            key={type}
            type={type}
            step={step}
            tierIndex={index}
            currentTier={royalty.currentTier}
            metrics={royalty.metrics}
          />
        ))}
      </div>
    </div>
  );
};

export default RoyaltyProgram;
