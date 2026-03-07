export default interface Royalty {
  step1: number;
  step2: number;
  step3: number;
  step4: number;
  step5: number;
  currentTier: number;
  currentTierName: string;
  nextTier: number | null;
  nextTierName: string | null;
  nextTierProgress: number;
  metrics: {
    completedJobs?: number;
    reviewCount?: number;
    averageRating?: number;
    totalEarning?: number;
    totalSpend?: number;
  };
}
