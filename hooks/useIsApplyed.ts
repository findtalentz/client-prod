import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useIsApplyed = createQuery<boolean, string>({
  queryKey: (jobId) => ["is_applyed", jobId],
  url: "/applications/is-applyed",
  method: "post",
  body: (jobId) => ({ job: jobId }),
  staleTime: CACHE.FREQUENT,
});

export default useIsApplyed;
