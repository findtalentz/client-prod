import Job from "@/schemas/Job";
import { createQuery } from "@/lib/create-query";

const useJobs = createQuery<Job[]>({
  queryKey: ["jobs"],
  url: "/jobs",
});

export default useJobs;
