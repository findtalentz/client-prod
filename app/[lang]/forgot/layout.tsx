import Image from "next/image";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Watermark logo on the right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
        <Image
          src="/logo.svg"
          alt=""
          width={500}
          height={500}
          className="w-[500px] h-auto"
        />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {children}
        </div>
        <div className="hidden md:block" />
      </div>
    </div>
  );
};

export default Layout;
