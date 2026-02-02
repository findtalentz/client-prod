import ApiResponse from "@/schemas/ApiRespose";
import Talentwishlist from "@/schemas/TalentWishlist";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useTalentWishlists = () => {
  return useQuery<ApiResponse<Talentwishlist[]>, Error>({
    queryKey: ["talentwishlist"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Talentwishlist[]>>("/talentwishlist")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useTalentWishlists;
