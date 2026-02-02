import ApiResponse from "@/schemas/ApiRespose";
import Jobwishlist from "@/schemas/JobWishlist";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useJobWishlists = () => {
  return useQuery<ApiResponse<Jobwishlist[]>, Error>({
    queryKey: ["jobwishlist"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Jobwishlist[]>>("/jobwishlist")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useJobWishlists;
