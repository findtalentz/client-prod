import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Grid } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

type CardType = "Welcome" | "Task" | "Pro" | "Expert" | "Master";

const cardColorMap: Record<CardType, string> = {
  Welcome: "bg-[#D5D7D9]",
  Task: "bg-[#A3BFDB]",
  Pro: "bg-[#D2AF65]",
  Expert: "bg-[#EF4045]",
  Master: "bg-[#2D2D2D]",
};

const cardTitleMap: Record<CardType, string> = {
  Welcome: "Newcomer",
  Task: "Task Achiever",
  Pro: "Pro Freelancer",
  Expert: "Expert Contributor",
  Master: "Master Freelancer",
};

const cardLogoMap: Record<CardType, string> = {
  Welcome: "/royalty/welcome.png",
  Task: "/royalty/task.png",
  Pro: "/royalty/pro.png",
  Expert: "/royalty/expert.png",
  Master: "/royalty/master.png",
};

const cardItemsMap: Record<CardType, string[]> = {
  Welcome: [
    "Complete at least one task",
    "Maintain 4.7 star overall rating",
    "Earn minimum $200",
  ],
  Task: [
    "Complete at least 5 tasks",
    "Maintain 4.7 star overall rating",
    "Earn minimum $400",
  ],
  Pro: [
    "Complete at least 10 tasks",
    "Maintain 4.7 star overall rating",
    "Earn minimum $1000",
  ],
  Expert: [
    "Complete at least 15 tasks",
    "Maintain 4.7 star overall rating",
    "Earn minimum $2500",
  ],
  Master: [
    "Complete at least 30 tasks",
    "Maintain 4.7 star overall rating",
    "Earn minimum $20000",
  ],
};

interface Props {
  type: CardType;
  step: number;
}

const RoyaltyCard = ({ type, step }: Props) => {
  return (
    <Grid columns={{ initial: "1", md: "400px 600px" }} gap="5">
      <div className="rounded-xl overflow-hidden relative">
        <Image
          src={cardLogoMap[type]}
          width={80}
          height={80}
          alt="logo"
          className="absolute top-0 right-0"
        />
        <div className={cn(cardColorMap[type], "p-3 space-y-5")}>
          <h3 className="text-white">{cardTitleMap[type]}</h3>
          <div className="text-white">
            {cardItemsMap[type].map((item, key) => (
              <Grid columns={"12px 1fr"} gap="2" key={key}>
                <div className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-gray-400 mt-1">
                  <FaCheck className="text-[10px]" />
                </div>
                {item}
              </Grid>
            ))}
          </div>
        </div>
        <div className="p-4 bg-[#F4F4F5]">
          <Link className="underline text-sm text-primary" href="/dashboard">
            Learn about the Royalty Program
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="font-medium">
            by <span className="text-primary">Sign up</span> and
            <span className="text-primary">complete tasks</span>
          </p>
          <Slider draggable={false} max={100} value={[step]} />
          <p className="text-sm font-medium text-primary">{step}% Completed</p>
        </div>
      </div>
    </Grid>
  );
};

export default RoyaltyCard;
