import ApiResponse from "@/schemas/ApiRespose";
import Application from "@/schemas/Application";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useSellerApplication = (jobId: string) => {
  return useQuery<ApiResponse<Application>, Error>({
    queryKey: ["seller_application", jobId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Application>>(`/applications/seller/${jobId}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useSellerApplication;
