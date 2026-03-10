import Container from "@/components/ui/container";
import { PropsWithChildren } from "react";
import SellerProfileSidebar from "./sidebar";
import Navbar from "./_components/Navbar";
import PageTransition from "./page-transition";

export default function SellerProfileLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Container>
        <div className="flex min-h-[calc(100vh-65px)]">
          <aside className="hidden md:block w-[260px] shrink-0 border-r border-gray-100 bg-white">
            <SellerProfileSidebar />
          </aside>
          <main className="flex-1 bg-gray-50/40 p-4 md:p-8 max-h-[calc(100vh-65px)] overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </Container>
    </>
  );
}
