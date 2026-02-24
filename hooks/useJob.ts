import Job from "@/schemas/Job";
import { createQuery } from "@/lib/create-query";

const useJob = createQuery<Job, string>({
  queryKey: (jobId) => ["job", jobId],
  url: (jobId) => `/jobs/${jobId}`,
});

export default useJob;
