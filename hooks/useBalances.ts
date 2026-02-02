import ApiResponse from "@/schemas/ApiRespose";
import Balance from "@/schemas/Balance";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useBalances = () => {
  return useQuery<ApiResponse<Balance[]>, Error>({
    queryKey: ["balances"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Balance[]>>("/balances")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useBalances;
