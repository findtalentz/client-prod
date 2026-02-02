import Contact from "@/components/contact";
import Navbar from "@/components/navbar";
import CallToAction from "@/components/call-to-action";
import Footer from "@/components/footer";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

const JobPageLayout = async ({ params, children }: Props) => {
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

export default JobPageLayout;
