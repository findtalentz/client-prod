import ApiResponse from "@/schemas/ApiRespose";
import Withdraw from "@/schemas/Withdraw";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

interface Params {
  status?: string;
  page?: number;
  pageSize?: number;
}

const useAdminWithdrawals = ({
  status,
  page = 1,
  pageSize = 10,
}: Params) => {
  return useQuery<ApiResponse<Withdraw[]>, Error>({
    queryKey: ["admin-withdrawals", status, page, pageSize],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Withdraw[]>>("/withdraws", {
          params: { status, page, pageSize },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useAdminWithdrawals;
