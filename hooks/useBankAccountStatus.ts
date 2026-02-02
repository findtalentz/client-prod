import ApiResponse from "@/schemas/ApiRespose";
import BankAccountStatus from "@/schemas/BankAccountStatus";
import Category from "@/schemas/Category";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useBankAccountStatus = () => {
  return useQuery<ApiResponse<BankAccountStatus>, Error>({
    queryKey: ["bank_account_status"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<BankAccountStatus>>("/auth/bank/status")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useBankAccountStatus;
