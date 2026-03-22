import { createQuery } from "@/lib/create-query";

interface ReviewSummaryData {
  summary: string;
  reviewCount: number;
  averageRating: number;
  generatedAt: string;
}

const useReviewSummary = createQuery<ReviewSummaryData | null, string>({
  queryKey: (sellerId) => ["review_summary", sellerId],
  url: (sellerId) => `/reviews/seller/${sellerId}/summary`,
});

export default useReviewSummary;
