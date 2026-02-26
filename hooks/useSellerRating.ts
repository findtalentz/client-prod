import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

interface SellerReview {
  averageRating: number;
  servicesRating: number;
  communicationRating: number;
  recommendationRating: number;
  descriptionRating: number;
}

const useSellerRating = createQuery<SellerReview[], string>({
  queryKey: (sellerId) => ["seller_reviews", sellerId],
  url: (sellerId) => `reviews/seller/${sellerId}`,
  staleTime: CACHE.FREQUENT,
});

export default useSellerRating;
