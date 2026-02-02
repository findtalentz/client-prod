import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import AboutFAQ from "../../../components/faq";
import AboutAction from "./_components/action";
import AboutHero from "./_components/hero";
import MissionGoals from "./_components/mission-goals";

interface Props {
  params: Promise<{
    lang: "en" | "ch";
  }>;
}

async function AboutUs({ params }: Props) {
  const { lang } = await params;
  return (
    <>
      <Navbar />
      <Container>
        <AboutHero lang={lang} />
        <MissionGoals lang={lang} />
        <AboutAction lang={lang} />
        <AboutFAQ lang={lang} />
      </Container>
      <Footer lang={lang} />
    </>
  );
}

export default AboutUs;
