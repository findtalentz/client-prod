import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useTotalEarning = createQuery<number>({
  queryKey: ["total_earning"],
  url: "/withdraws/earning",
  staleTime: CACHE.FREQUENT,
});

export default useTotalEarning;
