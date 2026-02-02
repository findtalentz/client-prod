import Image from "next/image";
import { getDictionary } from "../dictionaries";
interface Props {
  lang: "en" | "ch";
}

async function Partner({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.landingPage.partner;
  return (
    <div className="my-16 bg-primary-dark h-[500px] flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-8">
        <h1 className="!text-white"> {content} </h1>
        <Image src="/hkstp.png" width={250} height={100} alt="hkstp" />
      </div>
    </div>
  );
}

export default Partner;
