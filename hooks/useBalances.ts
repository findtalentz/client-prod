import Balance from "@/schemas/Balance";
import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useBalances = createQuery<Balance[]>({
  queryKey: ["balances"],
  url: "/balances",
  staleTime: CACHE.FREQUENT,
});

export default useBalances;
