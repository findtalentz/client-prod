"use client";
import Review from "@/schemas/Reviews";
import { Avatar } from "@radix-ui/themes";
import { Calendar, Star } from "lucide-react";

interface Props {
  reviews: Review[];
}

const Reviews = ({ reviews }: Props) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={`${
              index < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">{reviews.length}</span>
          <span>review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Avatar radius="full" src={review.buyer.image} fallback="U" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.buyer.firstName} {review.buyer.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar size={12} />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              {renderStars(review.averageRating)}
            </div>

            {/* Comment */}
            <p className="text-gray-700 leading-relaxed mb-3">
              {review.comment}
            </p>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span>Services</span>
                <span className="font-medium">{review.servicesRating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Communication</span>
                <span className="font-medium">
                  {review.communicationRating}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recommendation</span>
                <span className="font-medium">
                  {review.recommendationRating}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Description</span>
                <span className="font-medium">
                  {review.descriptionRating}/5
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Reviews;
