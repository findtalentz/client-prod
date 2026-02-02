"use client";

import { BounceLoader } from "react-spinners";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
      <BounceLoader size={300} color="#189294" />
    </div>
  );
}
