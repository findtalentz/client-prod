import LogoNavbar from "@/components/logoNav";
import { PropsWithChildren } from "react";

export default function LoginPageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <LogoNavbar />
      <div className="px-3 md:px-0">{children}</div>
    </>
  );
}
