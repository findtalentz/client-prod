import Link from "next/link";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

function BackButton() {
  return (
    <Link
      href="/"
      className="absolute cursor-pointer top-5 left-5 w-8 h-8 rounded-full bg-white flex items-center justify-center"
    >
      <FaArrowLeftLong />
    </Link>
  );
}

export default BackButton;
