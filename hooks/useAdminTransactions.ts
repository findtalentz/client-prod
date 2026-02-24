import Transaction from "@/schemas/Transaction";
import { createQuery } from "@/lib/create-query";

interface Params {
  status?: string;
  page?: number;
  pageSize?: number;
}

const useAdminTransactions = createQuery<Transaction[], Params>({
  queryKey: ({ status, page = 1, pageSize = 10 }) => [
    "admin-transactions",
    status,
    page,
    pageSize,
  ],
  url: "/transactions",
  params: ({ status, page = 1, pageSize = 10 }) => ({
    status,
    page,
    pageSize,
  }),
});

export default useAdminTransactions;
