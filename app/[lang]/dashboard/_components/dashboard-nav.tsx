"use client";
import { NotificationDialog } from "@/components/notification-dialog";
import { ProfileCard } from "@/components/profile-card";
import { useSidebar } from "@/components/ui/sidebar";
import { WishlistDialogClient } from "@/components/wishlist-dialog-client";
import { WishlistDialogSeller } from "@/components/wishlist-dialog-seller";
import useSession from "@/hooks/useSession";
import { MenuIcon } from "lucide-react";

export default function DashboardNav() {
  const { toggleSidebar } = useSidebar();
  const { data: user } = useSession();
  return (
    <div className="w-full h-[65px] flex items-center justify-between bg-primary-dark px-4">
      <div onClick={toggleSidebar}>
        <MenuIcon className="text-white" />
      </div>
      <div className="flex items-center gap-3 text-white">
        <NotificationDialog />
        {user && user.data && user.data.role === "CLIENT" && (
          <WishlistDialogClient />
        )}
        {user && user.data && user.data.role === "SELLER" && (
          <WishlistDialogSeller />
        )}

        <ProfileCard />
      </div>
    </div>
  );
}
