import Withdraw from "@/schemas/Withdraw";
import { createQuery } from "@/lib/create-query";

interface Params {
  status?: string;
  page?: number;
  pageSize?: number;
}

const useAdminWithdrawals = createQuery<Withdraw[], Params>({
  queryKey: ({ status, page = 1, pageSize = 10 }) => [
    "admin-withdrawals",
    status,
    page,
    pageSize,
  ],
  url: "/withdraws",
  params: ({ status, page = 1, pageSize = 10 }) => ({
    status,
    page,
    pageSize,
  }),
});

export default useAdminWithdrawals;
