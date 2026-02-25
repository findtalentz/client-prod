"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import useSession from "@/hooks/useSession";
import useTalentWishlists from "@/hooks/useTalentWishlists";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

interface Props {
  talentId: string;
}

const AddTalentWishlist = ({ talentId }: Props) => {
  const { data: user } = useSession();
  const { data: talentWishlist } = useTalentWishlists();
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const isLiked = talentWishlist?.data.some((t) => t.talent._id === talentId);

  const handleLikeClick = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      await apiClient.post("/talentwishlist", {
        talent: talentId,
      });
      queryClient.invalidateQueries({
        queryKey: ["talentwishlist"],
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update wishlist");
      }
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (!user) return null;
  if (user.data.role !== "CLIENT") return null;

  return (
    <div
      onClick={handleLikeClick}
      className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border border-gray-200 cursor-pointer relative"
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

export default AddTalentWishlist;
