"use client";
import { NotificationDialog } from "@/components/notification-dialog";
import { ProfileCard } from "@/components/profile-card";
import Container from "@/components/ui/container";
import { WishlistDialogSeller } from "@/components/wishlist-dialog-seller";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full h-[65px] flex items-center justify-center bg-primary-dark">
      <Container className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={120} height={40} priority />
        </Link>
        <div className="flex items-center justify-between gap-3">
          <NotificationDialog />
          <WishlistDialogSeller />
          <ProfileCard />
        </div>
      </Container>
    </div>
  );
}
