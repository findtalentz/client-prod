import ApiResponse from "@/schemas/ApiRespose";
import { PaymentMethod } from "@/schemas/PaymentMethod";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const usePaymentMethods = () => {
  return useQuery<ApiResponse<PaymentMethod[]>, Error>({
    queryKey: ["paymentMethods"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaymentMethod[]>>("/payment-methods")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default usePaymentMethods;
