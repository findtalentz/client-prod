import ApiResponse from "@/schemas/ApiRespose";
import Package from "@/schemas/Package";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const usePackages = (serviceId: string) => {
  return useQuery<ApiResponse<Package[]>, Error>({
    queryKey: ["packages", serviceId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Package[]>>("/packages", {
          params: {
            serviceId,
          },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default usePackages;
