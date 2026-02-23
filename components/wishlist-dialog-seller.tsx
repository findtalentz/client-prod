"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { WishlistDialog } from "@/components/wishlist-dialog";
import useJobWishlists from "@/hooks/useJobWishlist";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Briefcase, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

export function WishlistDialogSeller() {
  const { data, isLoading, error } = useJobWishlists();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (id: string) => {
    if (isRemoving) return;
    setIsRemoving(id);
    try {
      await apiClient.post("/jobwishlist", { job: id });
      queryClient.invalidateQueries({ queryKey: ["jobwishlist"] });
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
      )}
    />
  );
}
