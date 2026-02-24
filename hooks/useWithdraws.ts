import Withdraw from "@/schemas/Withdraw";
import { createQuery } from "@/lib/create-query";

const useWithdraws = createQuery<Withdraw[]>({
  queryKey: ["withdraws"],
  url: "/withdraws",
});

export default useWithdraws;
