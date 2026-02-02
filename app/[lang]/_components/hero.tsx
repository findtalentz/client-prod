import { CustomAvatarGroup } from "@/components/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsStarFill, BsStars } from "react-icons/bs";
import { getDictionary } from "../dictionaries";
import SearchBox from "./search-box";

interface Props {
  lang: "en" | "ch";
}

export default async function Hero({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.landingPage.hero;
  return (
    <div>
      <div className="bg-[#04201A] -mt-5">
        <Container className="flex items-center justify-center py-40">
          <div
            className="w-[663px] flex items-center justify-center flex-col"
            id="how-we-work"
          >
            <Link
              href="/chat"
              className="cursor-pointer mb-8 p-1.5 rounded-full pr-4 bg-primary-light/10 text-white flex items-center gap-2"
            >
              <div className="py-1.5 px-2 pr-3 text-[12px] bg-primary-light/20 rounded-full flex items-center">
                <BsStars className="text-[14px] mr-1" /> {content.button.badge}
              </div>{" "}
              <span> {content.button.label} </span> <BsArrowRight />
            </Link>
            <h1 className="mb-4 text-center px-6 md:px-0 !text-white w-full md:max-w-[550px] md:!text-[56px] text-[40px] md:leading-18 leading-10 font-[600]">
              {content.title1}{" "}
              <span className="text-primary">{content.brand}</span>{" "}
              {content.title2}
            </h1>
            <p className="!text-white mb-3">{content.subtitle}</p>
            <SearchBox />
            <div className="mt-6 flex items-center justify-center gap-3">
              <CustomAvatarGroup total={4251}>
                <Avatar className="w-12 h-12 border-2 border-primary-dark">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Remy Sharp"
                  />
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <Avatar className="w-12 h-12 border-2 border-primary-dark">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/2.jpg"
                    alt="Travis Howard"
                  />
                  <AvatarFallback>TH</AvatarFallback>
                </Avatar>
                <Avatar className="w-12 h-12 border-2 border-primary-dark">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/women/3.jpg"
                    alt="Agnes Walker"
                  />
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                <Avatar className="w-12 h-12 border-2 border-primary-dark">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/4.jpg"
                    alt="Trevor Henderson"
                  />
                  <AvatarFallback>TH</AvatarFallback>
                </Avatar>
              </CustomAvatarGroup>
              <div className="flex items-start flex-col gap-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <BsStarFill key={`${_} ${i}`} className="text-yellow-500" />
                  ))}
                </div>
                <p className="!text-white">{content.customers}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container className="flex items-center justify-center -mt-[13%] md:-mt-[8%]">
        <Image src={content.img} width={1400} height={800} alt="hero" />
      </Container>
    </div>
  );
}
