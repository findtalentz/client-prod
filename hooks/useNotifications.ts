import Notification from "@/schemas/Notification";
import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useNotifications = createQuery<Notification[]>({
  queryKey: ["notifications"],
  url: "/notifications",
  staleTime: CACHE.REALTIME,
});

export default useNotifications;
