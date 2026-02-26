import Transaction from "@/schemas/Transaction";
import { createQuery } from "@/lib/create-query";

const useMyTransactions = createQuery<Transaction[]>({
  queryKey: ["myTransactions"],
  url: "/transactions/my",
});

export default useMyTransactions;
