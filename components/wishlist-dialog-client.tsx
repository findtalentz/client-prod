"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import useTalentWishlists from "@/hooks/useTalentWishlists";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Briefcase, Heart, Loader2, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";

export function WishlistDialogClient() {
  const { data, isLoading, error } = useTalentWishlists();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (id: string) => {
    if (isRemoving) return;
    setIsRemoving(id);
    try {
      await apiClient.post("/talentwishlist", {
        talent: id,
      });
      queryClient.invalidateQueries({
        queryKey: ["talentwishlist"],
      });
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-white/50 hover:bg-white/70 transition-colors"
        >
          <Heart className="h-6 w-6" />
          {data?.data && data.data.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {data.data.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h4 className="font-semibold text-lg">My Wishlist</h4>
          </div>
          <Heart className="h-5 w-5 text-primary" />
        </div>

        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading wishlist...
              </span>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-destructive">
                Failed to load wishlist
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please try again later
              </p>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="font-medium text-muted-foreground">
                No talents saved
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start adding talents to your wishlist to see them here
              </p>
            </div>
          ) : (
            <div className="p-2">
              {data.data.map((wishlistItem) => (
                <div
                  key={wishlistItem._id}
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
                            .map((skill, index) => (
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
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
