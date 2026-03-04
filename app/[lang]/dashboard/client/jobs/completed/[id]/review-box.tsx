"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/services/api-client";
import { joiResolver } from "@hookform/resolvers/joi";
import { Grid } from "@radix-ui/themes";
import { AxiosError } from "axios";
import Joi from "joi";
import { MessageSquare, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  jobId: string;
  buyerId: string;
  sellerId: string;
}

const ReviewSchema = Joi.object({
  servicesRating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Service rating is required",
    "number.max": "Service rating must be between 1-5",
    "any.required": "Service rating is required",
  }),
  communicationRating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Communication rating is required",
    "number.max": "Communication rating must be between 1-5",
    "any.required": "Communication rating is required",
  }),
  recommendationRating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Recommendation rating is required",
    "number.max": "Recommendation rating must be between 1-5",
    "any.required": "Recommendation rating is required",
  }),
  descriptionRating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Description rating is required",
    "number.max": "Description rating must be between 1-5",
    "any.required": "Description rating is required",
  }),
  comment: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Please share your feedback",
    "string.min": "Comment must be at least 10 characters",
    "string.max": "Comment cannot exceed 1000 characters",
    "any.required": "Please share your feedback",
  }),
});

type FormData = {
  servicesRating: number;
  communicationRating: number;
  recommendationRating: number;
  descriptionRating: number;
  comment: string;
};

const ratingLabels: Record<string, { label: string; description: string }> = {
  servicesRating: {
    label: "Service Quality",
    description: "Quality of the delivered work",
  },
  communicationRating: {
    label: "Communication",
    description: "Responsiveness and clarity",
  },
  recommendationRating: {
    label: "Recommendation",
    description: "Would you recommend this seller?",
  },
  descriptionRating: {
    label: "As Described",
    description: "Service matched the description",
  },
};

const starLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const ReviewBox = ({ jobId, sellerId, buyerId }: Props) => {
  const router = useRouter();
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      servicesRating: 0,
      communicationRating: 0,
      recommendationRating: 0,
      descriptionRating: 0,
      comment: "",
    },
    resolver: joiResolver(ReviewSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.post("/reviews", {
        job: jobId,
        buyer: buyerId,
        seller: sellerId,
        ...data,
      });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      router.refresh();
      toast.success("Review submitted successfully!");
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to submit review"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const renderStars = (
    field: keyof Pick<
      FormData,
      | "servicesRating"
      | "communicationRating"
      | "recommendationRating"
      | "descriptionRating"
    >
  ) => {
    const value = watch(field);
    const hovered = hoveredStars[field] || 0;
    const displayValue = hovered || value;
    const error = errors[field];

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const ratingValue = index + 1;
            const isActive = ratingValue <= displayValue;

            return (
              <button
                key={index}
                type="button"
                className="focus:outline-none rounded-sm p-0.5 transition-transform hover:scale-110"
                onMouseEnter={() =>
                  setHoveredStars((prev) => ({ ...prev, [field]: ratingValue }))
                }
                onMouseLeave={() =>
                  setHoveredStars((prev) => ({ ...prev, [field]: 0 }))
                }
                onClick={() =>
                  setValue(field, ratingValue, { shouldValidate: true })
                }
              >
                <Star
                  size={24}
                  className={`transition-all duration-150 ${
                    isActive
                      ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                      : "text-gray-300"
                  }`}
                />
              </button>
            );
          })}
          {displayValue > 0 && (
            <span className="ml-2 text-sm font-medium text-amber-600">
              {starLabels[displayValue - 1]}
            </span>
          )}
        </div>
        {error && <p className="text-red-500 text-xs">{error.message}</p>}
      </div>
    );
  };

  const currentValues = watch();
  const filledRatings = [
    currentValues.servicesRating,
    currentValues.communicationRating,
    currentValues.recommendationRating,
    currentValues.descriptionRating,
  ].filter((r) => r > 0);

  const overallAvg =
    filledRatings.length > 0
      ? (filledRatings.reduce((a, b) => a + b, 0) / filledRatings.length).toFixed(1)
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          Leave a Review
        </h2>
        <p className="text-sm text-gray-500">
          Share your experience to help other clients and the seller
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Overall rating preview */}
        {overallAvg && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(parseFloat(overallAvg))
                        ? "text-amber-400 fill-amber-400"
                        : "text-amber-200"
                    }
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-amber-700">
                {overallAvg}
              </span>
              <span className="text-sm text-amber-600">Overall Rating</span>
            </div>
          </div>
        )}

        <div className="p-6">
          <h3 className="font-medium text-gray-900 mb-6">Rate Your Experience</h3>

          <Grid columns={{ initial: "1", md: "2" }} gap="6" className="mb-8">
            {(
              Object.keys(ratingLabels) as Array<keyof typeof ratingLabels>
            ).map((field) => (
              <div
                key={field}
                className="space-y-2 p-4 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    {ratingLabels[field].label}
                  </label>
                  <p className="text-xs text-gray-500">
                    {ratingLabels[field].description}
                  </p>
                </div>
                {renderStars(
                  field as keyof Pick<
                    FormData,
                    | "servicesRating"
                    | "communicationRating"
                    | "recommendationRating"
                    | "descriptionRating"
                  >
                )}
              </div>
            ))}
          </Grid>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-400" />
              <label className="block text-sm font-medium text-gray-800">
                Your Feedback
              </label>
            </div>
            <Textarea
              {...register("comment")}
              rows={4}
              placeholder="Tell us about your experience working with this seller. What went well? What could be improved?"
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50"
            />
            <div className="flex items-center justify-between">
              {errors.comment && (
                <p className="text-red-500 text-xs">{errors.comment.message}</p>
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {currentValues.comment?.length || 0}/1000 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="px-6"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReviewBox;
