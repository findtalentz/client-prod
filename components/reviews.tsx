"use client";
import ReviewSummaryComponent from "@/components/review-summary";
import Review from "@/schemas/Reviews";
import { Avatar } from "@radix-ui/themes";
import { Calendar, Star } from "lucide-react";

interface Props {
  reviews: Review[];
  sellerId?: string;
}

const ratingCategories = [
  { key: "servicesRating" as const, label: "Service Quality" },
  { key: "communicationRating" as const, label: "Communication" },
  { key: "recommendationRating" as const, label: "Recommendation" },
  { key: "descriptionRating" as const, label: "As Described" },
];

const Reviews = ({ reviews, sellerId }: Props) => {
  const overallAvg =
    reviews.length > 0
      ? parseFloat(
          (
            reviews.reduce((sum, r) => sum + r.averageRating, 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

  // Calculate average for each category
  const categoryAverages = ratingCategories.map((cat) => ({
    ...cat,
    avg: parseFloat(
      (
        reviews.reduce(
          (sum, r) => sum + r[cat.key],
          0
        ) / reviews.length
      ).toFixed(1)
    ),
  }));

  // Distribution: count of each star level
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.averageRating) === star).length,
    percentage:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => Math.round(r.averageRating) === star)
              .length /
              reviews.length) *
              100
          )
        : 0,
  }));

  const renderStars = (rating: number, size = 14) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : index < rating
                ? "text-amber-400 fill-amber-200"
                : "text-gray-200"
          }
        />
      ))}
    </div>
  );

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {reviews.length}
        </span>
      </div>

      {/* Summary Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-4xl font-bold text-gray-900">
              {overallAvg}
            </span>
            <div className="mt-1">{renderStars(overallAvg, 18)}</div>
            <span className="text-sm text-gray-500 mt-1">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {distribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-3">{star}</span>
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-7 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>

          {/* Category averages */}
          <div className="space-y-3 min-w-[200px]">
            {categoryAverages.map(({ label, avg }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(avg / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-6">
                    {avg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {sellerId && (
        <div className="mb-6">
          <ReviewSummaryComponent sellerId={sellerId} />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar
                  radius="full"
                  size="3"
                  src={review.buyer.image}
                  fallback={review.buyer.firstName?.charAt(0) || "U"}
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {review.buyer.firstName} {review.buyer.lastName}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <Calendar size={11} />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(review.averageRating)}
                <span className="text-sm font-semibold text-gray-700">
                  {review.averageRating.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {review.comment}
            </p>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
              {ratingCategories.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <div className="flex items-center gap-1">
                    <Star
                      size={11}
                      className="text-amber-400 fill-amber-400"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      {review[key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
