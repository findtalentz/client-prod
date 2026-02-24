import Talentwishlist from "@/schemas/TalentWishlist";
import { createQuery } from "@/lib/create-query";

const useTalentWishlists = createQuery<Talentwishlist[]>({
  queryKey: ["talentwishlist"],
  url: "/talentwishlist",
});

export default useTalentWishlists;
