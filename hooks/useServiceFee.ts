import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

interface ServiceFeeData {
  serviceFee: number;
  buyerServiceFee: number;
}

const useServiceFee = createQuery<ServiceFeeData>({
  queryKey: ["service-fee"],
  url: "/settings/public",
  staleTime: CACHE.STANDARD,
});

export default useServiceFee;

export function getCommissionRate(serviceFee: number) {
  return 1 - serviceFee / 100;
}
