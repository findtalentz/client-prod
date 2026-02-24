import Application from "@/schemas/Application";
import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useJobApplications = createQuery<Application[], string>({
  queryKey: (jobId) => ["jobapplications", jobId],
  url: (jobId) => `/applications/client/${jobId}`,
  params: (jobId) => ({ jobId }),
  staleTime: CACHE.FREQUENT,
});

export default useJobApplications;
