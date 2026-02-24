import { createQuery } from "@/lib/create-query";

const usePendingEarning = createQuery<number>({
  queryKey: ["pending_earning"],
  url: "/withdraws/earning/pending",
});

export default usePendingEarning;
