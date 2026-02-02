"use client";
import Image from "next/image";
import Link from "next/link";
import Container from "./ui/container";

export default function LogoNavbar() {
  return (
    <div className="w-full h-[65px] flex items-center justify-center bg-primary-dark">
      <Container className="flex items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={120} height={40} priority />
        </Link>
      </Container>
    </div>
  );
}
