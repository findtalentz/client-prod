import ApiResponse from "@/schemas/ApiRespose";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";

const usePendingEarning = () =>
  useQuery<ApiResponse<number>>({
    queryKey: ["pending_earning"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<number>>("/withdraws/earning/pending")
        .then((res) => res.data),
  });

export default usePendingEarning;
