import CallToAction from "@/components/call-to-action";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

const HirePageLayout = async ({ params, children }: Props) => {
  const { lang } = await params;
  const validatedLang = lang === "ch" ? "ch" : "en";

  return (
    <>
      <Navbar />
      {children}
      <CallToAction lang={validatedLang} />
      <Contact />
      <Footer lang={validatedLang} />
    </>
  );
};

export default HirePageLayout;
