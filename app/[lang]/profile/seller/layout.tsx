import Container from "@/components/ui/container";
import { Grid } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import SellerProfileSidebar from "./sidebar";
import Navbar from "./_components/Navbar";
import PageTransition from "./page-transition";

export default function SellerProfileLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Container>
        <Grid columns={{ initial: "1", md: "200px 1fr" }}>
          <SellerProfileSidebar />
          <div className="p-4 md:p-6 max-h-[calc(100vh-65px)] overflow-y-auto">
            <PageTransition>{children}</PageTransition>
          </div>
        </Grid>
      </Container>
    </>
  );
}
