import LogoNavbar from "@/components/logoNav";
import Container from "@/components/ui/container";
import { PropsWithChildren } from "react";

function IdentityVerificationPageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <LogoNavbar />
      <Container>{children}</Container>
    </>
  );
}

export default IdentityVerificationPageLayout;
