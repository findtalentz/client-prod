import Balance from "@/schemas/Balance";
import { createQuery } from "@/lib/create-query";

const useBalances = createQuery<Balance[]>({
  queryKey: ["balances"],
  url: "/balances",
});

export default useBalances;
