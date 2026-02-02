"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import useJobWishlists from "@/hooks/useJobWishlist";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Briefcase, Heart, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

export function WishlistDialogSeller() {
  const { data, isLoading, error } = useJobWishlists();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (id: string) => {
    if (isRemoving) return;
    setIsRemoving(id);
    try {
      await apiClient.post("/jobwishlist", {
        job: id,
      });
      queryClient.invalidateQueries({
        queryKey: ["jobwishlist"],
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

  const handleTalentClick = (id: string) => {
    window.open(`/jobs/${id}`, "_blank");
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
            <div className="p-2 space-y-3">
              {data.data.map((wishlistItem) => (
                <div
                  key={wishlistItem._id}
                  className={cn(
                    "group flex items-start gap-3 p-3 rounded-lg transition-colors",
                    "hover:bg-accent cursor-pointer border-b last:border-b-0"
                  )}
                >
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => handleTalentClick(wishlistItem.job._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm truncate"></h5>
                        {wishlistItem.job.title && (
                          <div className="flex items-center gap-1 mt-1">
                            <Briefcase className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground truncate">
                              {wishlistItem.job.title}
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
                          handleRemoveFromWishlist(wishlistItem.job._id);
                        }}
                        disabled={isRemoving === wishlistItem.job._id}
                      >
                        {isRemoving === wishlistItem.job._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        )}
                      </Button>
                    </div>
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
