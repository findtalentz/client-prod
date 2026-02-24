import { PaymentMethod } from "@/schemas/PaymentMethod";
import { createQuery } from "@/lib/create-query";

const usePaymentMethods = createQuery<PaymentMethod[]>({
  queryKey: ["paymentMethods"],
  url: "/payment-methods",
});

export default usePaymentMethods;
