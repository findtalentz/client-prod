import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IconType } from "react-icons";
import { BsWhatsapp } from "react-icons/bs";
import { FaMailchimp } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoLogoSlack } from "react-icons/io5";
import { SiNotion } from "react-icons/si";
import { getDictionary } from "../../dictionaries";

interface IconInterface {
  Icon: IconType;
  className?: string;
  size: number;
}

const CIcon = ({ Icon, className, size }: IconInterface) => {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white",
        `md:!w-${size} md:!h-${size}`,
        className
      )}
    >
      <Icon />
    </div>
  );
};

interface AboutActionProps {
  lang: "en" | "ch";
}

async function AboutAction({ lang }: AboutActionProps) {
  const dict = await getDictionary(lang);
  const content = dict.aboutPage.info;
  const action = dict.aboutPage.join;
  const solution = dict.aboutPage.solution;
  return (
    <div className="md:pt-20 pt-10">
      <div className="w-full flex items-center justify-center flex-col gap-1 mb-10">
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>
      <div className="w-full md:h-[523px] h-auto rounded-3xl overflow-hidden">
        <Image
          src="/about_growing.png"
          width={1200}
          height={550}
          alt="about"
          className="w-full h-full object-center"
        />
      </div>
      <div className="my-10 w-full flex items-center justify-between gap-2">
        <div className="flex-1 h-[2px] bg-gray-200"></div>
        <div className="px-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-dark" />
          <p className="md:!text-xl !text-black"> {action.label} </p>
        </div>
        <div className="flex-1 h-[2px] bg-gray-200"></div>
      </div>
      <div className="w-full flex items-center justify-center flex-col gap-3">
        <h2 className="max-w-[450px] text-center leading-10">{action.info}</h2>
        <p> {action.label2} </p>
        <Button size="lg" className="bg-black hover:bg-black/90 cursor-pointer">
          {action.button}
        </Button>
      </div>
      <div className="my-25 w-full h-[700px] rounded-3xl overflow-hidden flex items-center justify-center flex-col relative">
        <CIcon
          Icon={BsWhatsapp}
          size={16}
          className="bg-white absolute text-green-500 md:!text-[30px] text-xl md:top-40 top-20 md:right-75 left-10 w-10 h-10 md:h-16 md:w-16"
        />
        <CIcon
          Icon={FcGoogle}
          size={10}
          className="bg-white absolute text-[20px] md:top-30 top-25 md:left-85 right-10 w-11 h-11"
        />
        <CIcon
          Icon={SiNotion}
          size={12}
          className="bg-white absolute md:text-[25px] text-xl md:left-40 left-10 text-black w-10 h-10 md:w-12 md:h-12"
        />
        <CIcon
          Icon={IoLogoSlack}
          size={20}
          className="bg-white absolute md:text-[45px] text-3xl md:left-30 left-10 md:bottom-20 bottom-10 text-black w-12 h-12 md:w-20 md:h-20"
        />
        <CIcon
          Icon={FaMailchimp}
          size={12}
          className="bg-white absolute text-[30px] md:bottom-60 bottom-80 md:right-42 right-10 text-black w-10 h-10 md:w-12 md:h-12"
        />

        <Image
          src="/about_action.png"
          width={1200}
          height={700}
          alt="about"
          className="w-full h-full object-cover"
        />
        <div className="absolute w-full bottom-10 text-center space-y-1 flex items-center justify-center flex-col">
          <h2 className="!text-white !text-2xl md:!text-4xl">
            {solution.title}
          </h2>
          <p className="max-w-[500px] !text-white !text-sm md:!text-[16px]">
            {solution.subtitle}
          </p>
          <Button
            variant="outline"
            className="border-white text-white hover:text-white rounded-xl mt-3"
          >
            {solution.button}
          </Button>
        </div>
        <Image
          className="absolute w-[200px] md:w-auto"
          src="/logo_icon_lg.png"
          width={300}
          height={300}
          alt="logo"
        />
      </div>
    </div>
  );
}

export default AboutAction;
