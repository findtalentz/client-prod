"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistDialog } from "@/components/wishlist-dialog";
import useTalentWishlists from "@/hooks/useTalentWishlists";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Briefcase, Loader2, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";

export function WishlistDialogClient() {
  const { data, isLoading, error } = useTalentWishlists();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (id: string) => {
    if (isRemoving) return;
    setIsRemoving(id);
    try {
      await apiClient.post("/talentwishlist", { talent: id });
      queryClient.invalidateQueries({ queryKey: ["talentwishlist"] });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          "Like error:",
          error.response?.data?.message || error.message
        );
      }
    } finally {
      setIsRemoving(null);
    }
  };

  const handleTalentClick = (talentId: string) => {
    window.open(`/hire/preview?userId=${talentId}`, "_blank");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <WishlistDialog
      data={data?.data}
      isLoading={isLoading}
      error={error}
      emptyMessage="Start adding talents to your wishlist to see them here"
      getKey={(item) => item._id}
      renderItem={(wishlistItem) => (
        <div
          className={cn(
            "group flex items-start gap-3 p-3 rounded-lg transition-colors",
            "hover:bg-accent cursor-pointer border-b last:border-b-0"
          )}
        >
          <Avatar
            className="h-12 w-12 border cursor-pointer"
            onClick={() => handleTalentClick(wishlistItem.talent._id)}
          >
            <AvatarImage
              src={wishlistItem.talent.image}
              alt={`${wishlistItem.talent.firstName} ${wishlistItem.talent.lastName}`}
            />
            <AvatarFallback>
              {getInitials(
                wishlistItem.talent.firstName,
                wishlistItem.talent.lastName
              )}
            </AvatarFallback>
          </Avatar>

          <div
            className="flex-1 min-w-0"
            onClick={() => handleTalentClick(wishlistItem.talent._id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-sm truncate">
                  {wishlistItem.talent.firstName}{" "}
                  {wishlistItem.talent.lastName}
                </h5>
                {wishlistItem.talent.title && (
                  <div className="flex items-center gap-1 mt-1">
                    <Briefcase className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground truncate">
                      {wishlistItem.talent.title}
                    </p>
                  </div>
                )}
                {wishlistItem.talent.location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {wishlistItem.talent.location}
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWishlist(wishlistItem.talent._id);
                }}
                disabled={isRemoving === wishlistItem.talent._id}
              >
                {isRemoving === wishlistItem.talent._id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                )}
              </Button>
            </div>

            {wishlistItem.talent.skills &&
              wishlistItem.talent.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {wishlistItem.talent.skills
                    .slice(0, 3)
                    .map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  {wishlistItem.talent.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{wishlistItem.talent.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    />
  );
}
