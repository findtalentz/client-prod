"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface Props<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: unknown;
  emptyMessage?: string;
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
}

export function WishlistDialog<T>({
  data,
  isLoading,
  error,
  emptyMessage = "Start adding items to your wishlist to see them here",
  renderItem,
  getKey,
}: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-white/50 hover:bg-white/70 transition-colors"
        >
          <Heart className="h-6 w-6" />
          {data && data.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {data.length}
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
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="font-medium text-muted-foreground">
                No talents saved
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {emptyMessage}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {data.map((item) => (
                <div key={getKey(item)}>{renderItem(item)}</div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
