import Container from "@/components/ui/container";
import { Grid } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import SellerProfileSidebar from "./sidebar";
import Navbar from "./_components/Navbar";

export default function SellerProfileLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Container>
        <Grid columns={{ initial: "1", md: "200px 1fr" }}>
          <SellerProfileSidebar />
          <div className="p-4 max-h-[calc(100vh-65px)] overflow-y-scroll">
            {children}
          </div>
        </Grid>
      </Container>
    </>
  );
}
