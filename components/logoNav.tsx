"use client";
import Image from "next/image";
import Link from "next/link";
import Container from "./ui/container";
import LanguageSwitcher from "./language-switcher";

export default function LogoNavbar() {
  return (
    <div className="w-full h-[65px] flex items-center justify-center bg-primary-dark">
      <Container className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={120} height={40} priority />
        </Link>
        <LanguageSwitcher />
      </Container>
    </div>
  );
}
