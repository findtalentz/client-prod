import ApiResponse from "@/schemas/ApiRespose";
import Withdraw from "@/schemas/Withdraw";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useMyWithdraws = () => {
  return useQuery<ApiResponse<Withdraw[]>, Error>({
    queryKey: ["my_withdraws"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Withdraw[]>>("/withdraws/my")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useMyWithdraws;
