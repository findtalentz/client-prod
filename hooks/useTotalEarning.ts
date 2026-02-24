import { createQuery } from "@/lib/create-query";

const useTotalEarning = createQuery<number>({
  queryKey: ["total_earning"],
  url: "/withdraws/earning",
});

export default useTotalEarning;
