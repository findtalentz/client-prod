import Application from "@/schemas/Application";
import { createQuery } from "@/lib/create-query";

const useMyApplication = createQuery<Application, string>({
  queryKey: (jobId) => ["myjobapplication", jobId],
  url: "/applications/my",
  params: (jobId) => ({ jobId }),
});

export default useMyApplication;
