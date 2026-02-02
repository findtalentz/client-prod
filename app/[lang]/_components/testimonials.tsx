import React from "react";
import "./testimonials.css";
import { Avatar } from "@radix-ui/themes";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { getDictionary } from "../dictionaries";

interface Props {
  lang: "en" | "ch";
}

interface Tweet {
  id: number;
  avatar: string;
  text: string;
  name: string;
}

const Testimonials = async ({ lang }: Props) => {
  const dict = await getDictionary(lang);
  const content = dict.landingPage.testimonial;
  const tweets: Tweet[] = content.testimonials;

  const row1Tweets = tweets.slice(0, 3);
  const row2Tweets = tweets.slice(3, 6);

  const TweetCard: React.FC<{ tweet: Tweet }> = ({ tweet }) => (
    <div className="w-[450px] h-[200px] bg-white shadow rounded-2xl p-4 flex items-center justify-center flex-col relative">
      <div className="absolute left-5 top-5">
        <Image src="/quote.png" width={100} height={150} alt="quote" />
      </div>
      <div className="absolute -top-7 flex items-center justify-center flex-col gap-1 !mb-2">
        <Avatar size="5" src={tweet.avatar} fallback="Avatar" radius="full" />
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
        <p className="!text-xl !text-black">{tweet.name}</p>
      </div>
      <div className="w-full absolute bottom-5 px-4">
        <p className="text-center">{tweet.text}</p>
      </div>
    </div>
  );

  const MarqueeRow: React.FC<{
    tweets: Tweet[];
    direction?: "left" | "right";
    speed?: number;
  }> = ({ tweets, direction = "left", speed = 30 }) => {
    const duplicatedTweets = [...tweets, ...tweets, ...tweets, ...tweets];
    return (
      <div className="testimonial-row">
        <div
          className={`testimonial-marquee testimonial-marquee-${direction}`}
          style={{ "--speed": `${speed}s` } as React.CSSProperties}
        >
          {duplicatedTweets.map((tweet, index) => (
            <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h1 className="testimonials-title">{content.title}</h1>
        </div>

        <div className="testimonials-marquee-container py-20 !space-y-16">
          <MarqueeRow tweets={row1Tweets} direction="left" speed={40} />
          <MarqueeRow tweets={row2Tweets} direction="right" speed={35} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
