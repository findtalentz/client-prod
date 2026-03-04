import Review from "@/schemas/Reviews";
import { Avatar } from "@radix-ui/themes";
import { BadgeCheck, Calendar, Star } from "lucide-react";

interface Props {
  review: Review;
}

const ratingCategories = [
  { key: "servicesRating" as const, label: "Service Quality" },
  { key: "communicationRating" as const, label: "Communication" },
  { key: "recommendationRating" as const, label: "Recommendation" },
  { key: "descriptionRating" as const, label: "As Described" },
];

const ReviewDetails = ({ review }: Props) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Client Review</h3>
          {review.averageRating && (
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-blue-200">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(review.averageRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="font-bold text-blue-700 text-sm">
                {review.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Reviewer info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            radius="full"
            size="3"
            src={review.buyer.image}
            fallback={review.buyer.firstName?.charAt(0) || "U"}
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">
              {review.buyer.firstName} {review.buyer.lastName}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <BadgeCheck size={12} />
                Verified Client
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} />
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <p className="text-gray-700 text-sm leading-relaxed italic">
            &quot;{review.comment}&quot;
          </p>
        </div>

        {/* Rating breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {ratingCategories.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50"
            >
              <span className="text-xs text-gray-600">{label}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < review[key]
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {review[key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
