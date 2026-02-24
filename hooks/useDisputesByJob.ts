import Dispute from "@/schemas/Dispute";
import { createQuery } from "@/lib/create-query";

const useDisputesByJob = createQuery<Dispute[], string>({
  queryKey: (jobId) => ["job_disputes", jobId],
  url: (jobId) => `/disputes/job/${jobId}`,
});

export default useDisputesByJob;
