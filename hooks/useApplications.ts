import Application from "@/schemas/Application";
import { createQuery } from "@/lib/create-query";

const useApplications = createQuery<Application[], string>({
  queryKey: (jobId) => ["applications", jobId],
  url: "/applications",
  params: (jobId) => ({ jobId }),
});

export default useApplications;
