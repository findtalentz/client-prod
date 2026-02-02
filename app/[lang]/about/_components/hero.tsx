import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import { getDictionary } from "../../dictionaries";

interface AboutHeroProps {
  lang: "en" | "ch";
}

async function AboutHero({ lang }: AboutHeroProps) {
  const dict = await getDictionary(lang);
  const content = dict.aboutPage.hero;
  return (
    <Flex
      direction={{ initial: "column", md: "row" }}
      align="center"
      justify="between"
      px={{ initial: "4", md: "9" }}
      py="8"
      gap="9"
      className="bg-gray-50 rounded-3xl mt-16"
    >
      <div className="flex-1">
        <h1> {content.title} </h1>
        <p>{content.subtitle}</p>
      </div>
      <div className="flex-1">
        <Image src="/about_hero.png" width={450} height={450} alt="about" />
      </div>
    </Flex>
  );
}

export default AboutHero;
