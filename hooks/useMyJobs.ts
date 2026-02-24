import Job from "@/schemas/Job";
import { createQuery } from "@/lib/create-query";

const useMyJobs = createQuery<Job[], "OPEN" | "IN_PROGRESS" | "COMPLETED">({
  queryKey: (status) => ["my_jobs", status],
  url: "/jobs/client",
  params: (status) => ({ status }),
});

export default useMyJobs;
