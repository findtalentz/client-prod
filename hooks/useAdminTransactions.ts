import ApiResponse from "@/schemas/ApiRespose";
import Transaction from "@/schemas/Transaction";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

interface Params {
  status?: string;
  page?: number;
  pageSize?: number;
}

const useAdminTransactions = ({
  status,
  page = 1,
  pageSize = 10,
}: Params) => {
  return useQuery<ApiResponse<Transaction[]>, Error>({
    queryKey: ["admin-transactions", status, page, pageSize],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Transaction[]>>("/transactions", {
          params: { status, page, pageSize },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useAdminTransactions;
