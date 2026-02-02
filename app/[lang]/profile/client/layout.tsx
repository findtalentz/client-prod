import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import { PropsWithChildren } from "react";

export default function BuyerProfileLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Container>
        <div className="p-4">{children}</div>
      </Container>
    </>
  );
}
