import Service from "@/schemas/Service";
import { createQuery } from "@/lib/create-query";

const useService = createQuery<Service, string>({
  queryKey: (serviceId) => ["service", serviceId],
  url: (serviceId) => `/services/${serviceId}`,
});

export default useService;
