import { getDictionary } from "@/app/[lang]/dictionaries";
import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";

import { Grid } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { BiLogoLinkedin } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram, FaPhone } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { RiFacebookFill } from "react-icons/ri";
import LanguageSwitcher from "./language-switcher";
import SubscribeFrom from "./subscribe-from";

const socialIcons = [
  { id: "1", label: "Facebook", link: "", icon: <RiFacebookFill /> },
  { id: "2", label: "Instagram", link: "", icon: <FaInstagram /> },
  { id: "3", label: "Linkedin", link: "", icon: <BiLogoLinkedin /> },
  { id: "4", label: "X", link: "", icon: <BsTwitterX /> },
];

interface Props {
  lang: "en" | "ch";
}

async function Footer({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.footer;
  return (
    <div className="bg-[#04201A] py-26">
      <Container>
        <div className="w-full flex items-center justify-center mb-10">
          <div className="flex items-center justify-between px-4 flex-col md:flex-row gap-6 max-w-3xl">
            <Image
              src={content.img}
              width={400}
              height={300}
              alt="ai"
              className="w-full"
            />
            <div>
              <p className="text-2xl text-white mb-4">{content.title}</p>
              <Link
                className={buttonVariants({ size: "lg", variant: "light" })}
                href="/chat"
              >
                {content.button}
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-3xl shadow md:p-16 p-4">
          <Grid columns={{ initial: "2", md: "9" }} gap="6">
            <div className="col-span-3">
              <Image src="/logo.svg" width={180} height={80} alt="logo" />
              <p className="text-gray-100 text-[18px] my-3">
                {" "}
                {content.Subscribe}{" "}
              </p>
              <SubscribeFrom text={content.submit} />
              <div className="flex items-center justify-start gap-4 mt-6">
                {socialIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className="w-10 cursor-pointer h-10 rounded-full bg-white/40 flex items-center justify-center text-white text-xl"
                  >
                    {icon.icon}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <h5 className="text-white text-xl mb-3"> {content.Services} </h5>
              <div className="space-y-2 flex flex-col text-sm">
                {content.servicesLinke.map((service) => (
                  <Link
                    key={service.id}
                    href={service.link}
                    className="text-white"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <h5 className="text-white text-xl mb-3">Talentz</h5>
              <div className="space-y-2 flex flex-col text-sm">
                {content.Talentz.map((item) => (
                  <Link key={item.id} href={item.link} className="text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <h5 className="text-white text-xl mb-3"> {content.ContactUs} </h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaPhone className="text-white" />{" "}
                  <p className="text-white ms-1">+852 93312393</p>
                </div>
                <div className="flex items-center text-white">
                  <IoMailOutline className="text-white" />{" "}
                  <p className="text-white ms-1">info@findTalentz.com</p>
                </div>
              </div>
            </div>
          </Grid>
          <div className="w-full flex items-center justify-between flex-col md:flex-row mt-12 gap-6">
            <p className="text-white">{content.Copyright}</p>

            <div className="flex items-center gap-7 md:gap-4">
              <LanguageSwitcher />
              {content.legal.map((item) => (
                <Link key={item.id} className="text-white" href={item.link}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Footer;
