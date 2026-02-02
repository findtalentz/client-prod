import ApiResponse from "@/schemas/ApiRespose";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useService = (serviceId: string) => {
  return useQuery<ApiResponse<Service>, Error>({
    queryKey: ["service", serviceId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Service>>(`/services/${serviceId}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useService;
