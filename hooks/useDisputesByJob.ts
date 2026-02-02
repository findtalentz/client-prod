import ApiResponse from "@/schemas/ApiRespose";
import Dispute from "@/schemas/Dispute";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";

const useDisputesByJob = (jobId: string) =>
  useQuery({
    queryKey: ["job_disputes"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Dispute[]>>(`/disputes/job/${jobId}`)
        .then((res) => res.data),

    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

export default useDisputesByJob;
