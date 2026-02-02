import ApiResponse from "@/schemas/ApiRespose";
import Withdraw from "@/schemas/Withdraw";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useWithdraws = () => {
  return useQuery<ApiResponse<Withdraw[]>, Error>({
    queryKey: ["withdraws"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Withdraw[]>>("/withdraws")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useWithdraws;
