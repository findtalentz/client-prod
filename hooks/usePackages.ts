import Package from "@/schemas/Package";
import { createQuery } from "@/lib/create-query";

const usePackages = createQuery<Package[], string>({
  queryKey: (serviceId) => ["packages", serviceId],
  url: "/packages",
  params: (serviceId) => ({ serviceId }),
});

export default usePackages;
