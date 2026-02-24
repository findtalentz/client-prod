import Withdraw from "@/schemas/Withdraw";
import { createQuery } from "@/lib/create-query";

const useMyWithdraws = createQuery<Withdraw[]>({
  queryKey: ["my_withdraws"],
  url: "/withdraws/my",
});

export default useMyWithdraws;
