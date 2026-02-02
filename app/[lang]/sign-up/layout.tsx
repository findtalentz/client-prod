import LogoNavbar from "@/components/logoNav";
import { PropsWithChildren } from "react";

const SignUpLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <LogoNavbar />
      <div className="px-3 md:px-0">{children}</div>
    </>
  );
};

export default SignUpLayout;
