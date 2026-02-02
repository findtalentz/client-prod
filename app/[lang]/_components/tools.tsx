import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { BsMessenger, BsWhatsapp, BsWordpress } from "react-icons/bs";
import { CgCircleci } from "react-icons/cg";
import { FaDiscord, FaShopify, FaSlack } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { getDictionary } from "../dictionaries";

interface IconInterface {
  Icon: IconType;
  className?: string;
}

interface Props {
  lang: "en" | "ch";
}

const CIcon = ({ Icon, className }: IconInterface) => {
  return (
    <div
      className={cn(
        "bg-black/10 rounded-md md:rounded-2xl backdrop-blur-sm flex items-center justify-center p-1",
        className
      )}
    >
      <div className="w-6 md:w-10 h-6 md:h-10 bg-gray-900 rounded md:rounded-xl text-sm md:text-2xl flex items-center justify-center text-white">
        <Icon />
      </div>
    </div>
  );
};

async function Tools({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.landingPage.tools;
  return (
    <Container className="space-y-18">
      <div className="flex items-center justify-center">
        <div className="max-w-xl text-center flex items-center justify-center flex-col gap-3">
          <h1 className="leading-11">{content.title}</h1>
          <p> {content.subtitle} </p>
          <Button size="lg" className="mt-5">
            {content.button}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center -mt-[250px] md:-mt-[400px]">
        <div className="relative h-[460px] w-full max-w-[600px] border-dashed border-b flex items-center justify-center flex-col md:h-[800px] md:max-w-[800px]">
          <div className="w-full h-[50%] border border-gray-500 rounded-tl-full rounded-tr-full absolute bottom-0"></div>
          <div className="w-[80%] h-[40%] border border-gray-500 rounded-tl-full rounded-tr-full absolute bottom-0"></div>
          <div className="w-[60%] h-[30%] border border-gray-500 rounded-tl-full rounded-tr-full absolute bottom-0"></div>
          <div className="w-[40%] h-[20%] border border-gray-500 rounded-tl-full rounded-tr-full absolute bottom-0"></div>
          <div className="w-[20%] h-[10%] border border-gray-500 rounded-tl-full rounded-tr-full absolute bottom-0"></div>
          <div className="w-full h-[50%] bg-gradient-to-b to-[#e7e7e7] from-transparent rounded-tl-full rounded-tr-full absolute bottom-0"></div>
          <div className="absolute top-[57%]">
            <CIcon Icon={CgCircleci} />
          </div>
          <div className="absolute bottom-[24%] w-[30%] flex items-center justify-between">
            <CIcon Icon={SiNotion} />
            <CIcon Icon={FaDiscord} />
          </div>
          <div className="absolute bottom-[15%] w-[80%] flex items-center justify-between">
            <CIcon Icon={BsWordpress} />
            <CIcon Icon={FaShopify} />
          </div>
          <div className="absolute bottom-[5%] w-[45%] flex items-center justify-between">
            <CIcon Icon={FaSlack} />
            <CIcon Icon={BsWhatsapp} className="-mt-10" />
            <CIcon Icon={BsMessenger} />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Tools;
