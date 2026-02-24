import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useCompletedJobCount = createQuery<number, string>({
  queryKey: (sellerId) => ["completedjobs", sellerId],
  url: "jobs/count",
  params: (sellerId) => ({ sellerId, status: "COMPLETED" }),
  staleTime: CACHE.FREQUENT,
});

export default useCompletedJobCount;
