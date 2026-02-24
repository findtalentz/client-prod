import User from "@/schemas/User";
import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useSession = createQuery<User>({
  queryKey: ["session"],
  url: "/auth/me",
  staleTime: CACHE.FREQUENT,
});

export default useSession;
