import Review from "@/schemas/Reviews";
import { Avatar } from "@radix-ui/themes";

interface Props {
  review: Review;
}

const StarIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ReviewDetails = ({ review }: Props) => {
  return (
    <div
      key={review._id}
      className="border border-gray-100 rounded-2xl p-6 bg-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <Avatar
          radius="full"
          src={review.buyer.image}
          fallback={review.buyer.firstName?.charAt(0) || "U"}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 truncate">
              {review.buyer.firstName} {review.buyer.lastName}
            </h4>
            {review.averageRating && (
              <div className="flex items-center space-x-1 bg-linear-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-bold text-blue-900 text-sm">
                  {review.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-3 italic">
            &quot;{review.comment}&quot;
          </p>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Verified Client</span>
            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
