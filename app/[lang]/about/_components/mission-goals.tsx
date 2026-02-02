import { Flex } from "@radix-ui/themes";
import { getDictionary } from "../../dictionaries";

interface Props {
  lang: "en" | "ch";
}

async function MissionGoals({ lang }: Props) {
  const dict = await getDictionary(lang);
  const goals = dict.aboutPage.goals;
  const mission = dict.aboutPage.mission;
  return (
    <Flex
      direction={{ initial: "column", md: "row" }}
      align="center"
      justify="between"
      px={{ initial: "4", md: "9" }}
      py="8"
      className="md:mt-16 gap-10 md:gap-40"
    >
      <div className="md:-mt-20">
        <h1> {mission.title} </h1>
        <p>{mission.subtitle}</p>
      </div>
      <div className="md:mt-20 ps-10 md:ps-0">
        <h1> {goals.title} </h1>
        <p>{goals.subtitle}</p>
      </div>
    </Flex>
  );
}

export default MissionGoals;
