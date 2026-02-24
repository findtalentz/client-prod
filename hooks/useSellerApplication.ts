import Application from "@/schemas/Application";
import { createQuery } from "@/lib/create-query";

const useSellerApplication = createQuery<Application, string>({
  queryKey: (jobId) => ["seller_application", jobId],
  url: (jobId) => `/applications/seller/${jobId}`,
});

export default useSellerApplication;
