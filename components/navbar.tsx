"use client";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import LanguageSwitcher from "./language-switcher";
import { NotificationDialog } from "./notification-dialog";
import { ProfileCard } from "./profile-card";
import { Button, buttonVariants } from "./ui/button";
import Container from "./ui/container";
import { WishlistDialogClient } from "./wishlist-dialog-client";
import { WishlistDialogSeller } from "./wishlist-dialog-seller";

const navItems = [
  { id: "1", label: "About Us", path: "/about" },
  { id: "2", label: "Jobs", path: "/jobs" },
  { id: "3", label: "Hire", path: "/hire" },
  { id: "4", label: "Blog", path: "/blog" },
  { id: "5", label: "Contact Us", path: "/contact" },
];

const toggleLineClasses = "h-[2px] bg-white w-[26px] transition-all";
const flexClasses = "flex items-center gap-3";

const HamburgerMenu = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="md:hidden flex items-start flex-col gap-[5px] cursor-pointer z-1000!"
    aria-label="Toggle menu"
  >
    <div
      className={cn(
        toggleLineClasses,
        isActive && "-rotate-45 translate-x-[5px] translate-y-[7px]"
      )}
    ></div>
    <div
      className={cn(toggleLineClasses, "w-4", isActive && "opacity-0")}
    ></div>
    <div
      className={cn(
        toggleLineClasses,
        isActive && "rotate-45 translate-x-[5px] -translate-y-[7px]"
      )}
    ></div>
  </div>
);

const NavMenu = ({ isActive }: { isActive: boolean }) => {
  const { data } = useSession();
  const session = data?.data;

  return (
    <ul
      className={cn(
        "nav-menu transition-all bg-primary-dark! items-start w-full! px-3! gap-0! z-9999",
        isActive && "nav-show"
      )}
    >
      {navItems.map((item) => (
        <li key={item.id} className="border-b w-full py-5">
          <Link className="text-white text-[13px]" href={item.path}>
            {item.label}
          </Link>
        </li>
      ))}
      {!session && (
        <div className="flex items-center justify-center gap-5 w-full md:hidden mt-10">
          <Link
            href="/log-in"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "px-8 text-white border-white"
            )}
          >
            Log In
          </Link>
          <Link className={cn(buttonVariants(), "px-8")} href="/sign-up">
            Sign Up
          </Link>
        </div>
      )}
    </ul>
  );
};

export default function Navbar() {
  const { data, isLoading } = useSession();
  const session = data?.data;
  const [isActive, setActive] = useState(false);
  const toggleMenu = useCallback(() => setActive((prev) => !prev), []);

  return (
    <>
      <div className="fixed w-full z-1000000 top-0 left-0 h-[65px] flex items-center justify-center bg-primary-dark">
        <Container>
          <nav className="flex items-center justify-between">
            <div className={flexClasses}>
              <Link href="/" className="relative z-10">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={120}
                  height={40}
                  priority
                  className="mb-1"
                />
              </Link>
              <div className="md:hidden">
                <NavMenu isActive={isActive} />
              </div>
              <ul className="hidden md:flex items-center gap-5">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link className="text-white text-[13px]" href={item.path}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={flexClasses}>
              <div className={cn(flexClasses, "hidden md:flex")}>
                {!isLoading && !session && (
                  <>
                    <Link href="/log-in" className="text-white text-[13px]">
                      Log In
                    </Link>
                    <Link href="/sign-up">
                      <Button className="py-2 px-8 text-[13px]">Sign Up</Button>
                    </Link>
                  </>
                )}
                {session && (
                  <div className="flex items-center gap-3">
                    <ProfileCard />
                    {session.role === "CLIENT" && <WishlistDialogClient />}
                    {session.role === "SELLER" && <WishlistDialogSeller />}
                    <NotificationDialog />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="block md:hidden">
                  {session && <ProfileCard />}
                </div>
                <HamburgerMenu isActive={isActive} onClick={toggleMenu} />

                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </nav>
        </Container>
      </div>
      <div className="h-[70px]" />
    </>
  );
}
