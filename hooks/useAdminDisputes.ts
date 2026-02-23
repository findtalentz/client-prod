import ApiResponse from "@/schemas/ApiRespose";
import Dispute from "@/schemas/Dispute";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useAdminDisputes = () => {
  return useQuery<ApiResponse<Dispute[]>, Error>({
    queryKey: ["admin-disputes"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Dispute[]>>("/disputes")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useAdminDisputes;
