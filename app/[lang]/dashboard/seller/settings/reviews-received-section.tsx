"use client";

import ReviewSummary from "@/components/review-summary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSession from "@/hooks/useSession";
import ApiResponse from "@/schemas/ApiRespose";
import Review from "@/schemas/Reviews";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@radix-ui/themes";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import { BeatLoader } from "react-spinners";

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
        <span className="text-xs font-medium ml-1">{rating}</span>
      </div>
    </div>
  );
}

export default function ReviewsReceivedSection() {
  const { data: session } = useSession();
  const sellerId = session?.data?._id;

  const { data, isLoading } = useQuery<ApiResponse<Review[]>>({
    queryKey: ["seller-reviews", sellerId],
    queryFn: () =>
      apiClient.get(`/reviews/seller/${sellerId}`).then((r) => r.data),
    enabled: !!sellerId,
  });

  const reviews = data?.data || [];

  const overallAvg =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.averageRating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const categoryAvgs =
    reviews.length > 0
      ? {
          services: (
            reviews.reduce((s, r) => s + r.servicesRating, 0) / reviews.length
          ).toFixed(1),
          communication: (
            reviews.reduce((s, r) => s + r.communicationRating, 0) /
            reviews.length
          ).toFixed(1),
          recommendation: (
            reviews.reduce((s, r) => s + r.recommendationRating, 0) /
            reviews.length
          ).toFixed(1),
          description: (
            reviews.reduce((s, r) => s + r.descriptionRating, 0) /
            reviews.length
          ).toFixed(1),
        }
      : null;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      {!isLoading && reviews.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-xs text-gray-500">Total Reviews</p>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallAvg}</p>
                <p className="text-xs text-gray-500">Average Rating</p>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {reviews.filter((r) => r.averageRating >= 4).length}
                </p>
                <p className="text-xs text-gray-500">Positive Reviews (4+)</p>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          {categoryAvgs && (
            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Service Quality", value: categoryAvgs.services },
                    {
                      label: "Communication",
                      value: categoryAvgs.communication,
                    },
                    {
                      label: "Recommendation",
                      value: categoryAvgs.recommendation,
                    },
                    {
                      label: "As Described",
                      value: categoryAvgs.description,
                    },
                  ].map((cat) => (
                    <div
                      key={cat.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                              width: `${(parseFloat(cat.value) / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">
                          {cat.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* AI Summary */}
      {sellerId && reviews.length > 0 && <ReviewSummary sellerId={sellerId} />}

      {/* Reviews list */}
      <Card>
        <CardHeader>
          <CardTitle>Client Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <BeatLoader color="hsl(var(--primary))" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">
                Complete projects to start receiving reviews from clients.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={review.buyer.image ?? undefined}
                        fallback={review.buyer.firstName?.[0] ?? "?"}
                        size="3"
                        radius="full"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {review.buyer.firstName} {review.buyer.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {review.averageRating}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
                    <StarRating
                      rating={review.servicesRating}
                      label="Service Quality"
                    />
                    <StarRating
                      rating={review.communicationRating}
                      label="Communication"
                    />
                    <StarRating
                      rating={review.recommendationRating}
                      label="Recommendation"
                    />
                    <StarRating
                      rating={review.descriptionRating}
                      label="As Described"
                    />
                  </div>

                  {review.comment && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
