import LogoNavbar from "@/components/logoNav";
import { Grid } from "@radix-ui/themes";
import Image from "next/image";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <LogoNavbar />
      <Grid columns={{ initial: "1", md: "2" }}>
        {children}
        <div className="md:flex items-center justify-between hidden">
          <Image
            src="/join_illustration.jpg"
            width={1200}
            height={1800}
            className="w-full h-[calc(100dvh-65px)] object-cover"
            alt="Illustration"
          />
        </div>
      </Grid>
    </>
  );
};

export default Layout;
