import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const usePendingEarning = createQuery<number>({
  queryKey: ["pending_earning"],
  url: "/withdraws/earning/pending",
  staleTime: CACHE.FREQUENT,
});

export default usePendingEarning;
