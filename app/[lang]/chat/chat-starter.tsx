"use client";
import useMessageStore from "@/store";
import React from "react";
import { BsStars } from "react-icons/bs";

function ChatStarter() {
  const { setShowMessages } = useMessageStore();
  return (
    <>
      <div>
        <div className="w-full h-full flex items-center justify-center flex-col space-y-2">
          <div className="py-1 rounded-full px-2 bg-primary-light/10 text-white flex items-center gap-2">
            <BsStars className="text-[16px]" />
            <span>TalentzAI</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <h1 className="!text-white !text-2xl md:!text-4xl">
              How can I help you today?
            </h1>
            <p className="!text-white md:!text-[18px] text-center text-sm mt-2">
              Try asking me about your tasks, finding information, or just
              chatting!
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5 flex-col md:flex-row">
        <div
          onClick={() => setShowMessages(true)}
          className="p-4 space-y-3 bg-white rounded-2xl max-w-[280px] cursor-pointer"
        >
          <div className="flex items-center justify-center flex-col">
            <BsStars className="text-primary-dark text-5xl" />
            <h3 className="!text-xl">Find A Freelance Job</h3>
          </div>
          <div className="space-y-3">
            <p className="!text-[15px]">
              &ldquo;How do I create a profile on this platform?&ldquo;
            </p>
            <p className="!text-[15px]">
              &ldquo;How can I find projects that match my skills?&ldquo;
            </p>
            <p className="!text-[15px]">
              &ldquo;How to showcase my skill?&ldquo;
            </p>
          </div>
        </div>
        <div
          onClick={() => setShowMessages(true)}
          className="p-4 space-y-3 bg-white rounded-2xl max-w-[280px] cursor-pointer"
        >
          <div className="flex items-center justify-center flex-col">
            <BsStars className="text-primary-dark text-5xl" />
            <h3 className="!text-xl">Hire Freelancer</h3>
          </div>
          <div className="space-y-3">
            <p className="!text-[15px]">
              &ldquo;How do I post a project on the platform?&ldquo;
            </p>
            <p className="!text-[15px]">
              &ldquo;What types of services are available on the
              platform?&ldquo;
            </p>
            <p className="!text-[15px]">
              &ldquo;Help me find a freelancer of XX&ldquo;
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatStarter;
