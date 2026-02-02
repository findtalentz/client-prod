import ApiResponse from "@/schemas/ApiRespose";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";

const useTotalEarning = () =>
  useQuery<ApiResponse<number>>({
    queryKey: ["total_earning"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<number>>("/withdraws/earning")
        .then((res) => res.data),
  });

export default useTotalEarning;
