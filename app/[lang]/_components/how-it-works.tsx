import Container from "@/components/ui/container";
import Image from "next/image";
import { getDictionary } from "../dictionaries";

interface Props {
  lang: "en" | "ch";
}

async function HowTtWorks({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.landingPage.how;
  return (
    <Container>
      <h1 className="text-center !mt-10 !text-black !font-semibold">
        {content.title}
      </h1>
      <div className="mt-10 flex items-center justify-center w-full relative overflow-hidden z-50">
        <Image
          src={content.img}
          width={1200}
          height={700}
          alt="how"
          className="w-full h-auto -z-10"
        />
        <div className="absolute w-full h-[70%] md:bottom-0 -bottom-1 bg-gradient-to-t from-[#e7e7e7] from-20% md:from-10% to-transparent z-20" />
      </div>
    </Container>
  );
}

export default HowTtWorks;
