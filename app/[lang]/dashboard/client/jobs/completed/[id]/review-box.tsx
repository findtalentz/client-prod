"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/services/api-client";
import { joiResolver } from "@hookform/resolvers/joi";
import { Grid } from "@radix-ui/themes";
import { AxiosError } from "axios";
import Joi from "joi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

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
  comment: Joi.string().max(1000).allow("").optional(),
});

type FormData = {
  servicesRating: number;
  communicationRating: number;
  recommendationRating: number;
  descriptionRating: number;
  comment: string;
};

const ReviewBox = ({ jobId, sellerId, buyerId }: Props) => {
  const router = useRouter();
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
      router.refresh();
      toast.success("Review submitted successfully!");
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to submit review");
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
    const error = errors[field];

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                onClick={() =>
                  setValue(field, ratingValue, { shouldValidate: true })
                }
              >
                <FaStar
                  size={22}
                  className={`transition-colors ${
                    ratingValue <= value ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-400`}
                />
              </button>
            );
          })}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  };

  const currentValues = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Service Review</h2>
        <p className="text-gray-600">
          Share your experience with the history research proofreading and
          editing service
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <h3 className="font-medium text-gray-900 text-lg mb-6">
          Service Feedback
        </h3>

        <Grid columns={{ initial: "1", md: "2" }} gap="5" className="mb-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Service Quality
            </label>
            {renderStars("servicesRating")}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Communication
            </label>
            {renderStars("communicationRating")}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Recommendation
            </label>
            {renderStars("recommendationRating")}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Service as Described
            </label>
            {renderStars("descriptionRating")}
          </div>
        </Grid>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Additional Comments
          </label>
          <Textarea
            {...register("comment")}
            rows={4}
            placeholder="Share any additional feedback about your experience..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500">
            {currentValues.comment.length}/1000 characters
          </p>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Submitting Review..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReviewBox;
