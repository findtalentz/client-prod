"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import useJobWishlists from "@/hooks/useJobWishlist";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Props {
  jobId: string;
  className?: string;
}

const AddJobWishlist = ({ jobId, className }: Props) => {
  const { data: user } = useSession();
  const { data: jobWishlist } = useJobWishlists();
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const isLiked = jobWishlist?.data.some((t) => t.job._id === jobId);

  const handleLikeClick = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      await apiClient.post("/jobwishlist", {
        job: jobId,
      });
      queryClient.invalidateQueries({
        queryKey: ["jobwishlist"],
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          "Like error:",
          error.response?.data?.message || error.message
        );
      }
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (!user) return null;
  if (user.data.role !== "SELLER") return null;

  return (
    <div
      onClick={handleLikeClick}
      className={cn(
        "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border border-gray-200 cursor-pointer absolute right-3 top-3",
        className
      )}
    >
      {isLikeLoading ? (
        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      ) : isLiked ? (
        <FaHeart className="text-primary text-sm md:text-[16px]" />
      ) : (
        <FaRegHeart className="text-primary text-sm md:text-[16px]" />
      )}
    </div>
  );
};

export default AddJobWishlist;
