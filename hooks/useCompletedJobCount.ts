import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useCompletedJobCount = (sellerId: string) => {
  return useQuery<ApiResponse<number>, Error>({
    queryKey: ["completedjobs", sellerId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<number>>("jobs/count", {
          params: { sellerId, status: "COMPLETED" },
        })
        .then((res) => res.data),
    staleTime: 60 * 1000,
  });
};

export default useCompletedJobCount;
