"use client";
import useMessageStore from "@/store";
import { Briefcase, Sparkles, UserSearch } from "lucide-react";

function ChatStarter() {
  const { setShowMessages } = useMessageStore();

  return (
    <>
      {/* Hero section */}
      <div className="flex flex-col items-center text-center px-4 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light/10 border border-primary-light/20 mb-5">
          <Sparkles className="w-4 h-4 text-primary-light" />
          <span className="text-sm font-medium text-primary-light">TalentzAI</span>
        </div>
        <h1 className="!text-2xl md:!text-4xl !font-semibold !text-white tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-white/50 text-sm md:text-base mt-3 max-w-md leading-relaxed">
          Try asking me about your tasks, finding information, or just chatting!
        </p>
      </div>

      {/* Suggestion cards */}
      <div className="flex items-stretch justify-center gap-4 flex-col md:flex-row px-6 w-full max-w-[640px]">
        <div
          onClick={() => setShowMessages(true)}
          className="flex-1 p-5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-primary-light/30 rounded-2xl cursor-pointer transition-all duration-200 group"
        >
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-dark/50 flex items-center justify-center mb-3 group-hover:bg-primary-dark/70 transition-colors">
              <Briefcase className="w-5 h-5 text-primary-light" />
            </div>
            <h3 className="!text-base !font-semibold !text-white">
              Find A Freelance Job
            </h3>
          </div>
          <div className="space-y-2.5">
            <p className="!text-[13px] !text-white/40 leading-relaxed">
              &ldquo;How do I create a profile on this platform?&rdquo;
            </p>
            <p className="!text-[13px] !text-white/40 leading-relaxed">
              &ldquo;How can I find projects that match my skills?&rdquo;
            </p>
            <p className="!text-[13px] !text-white/40 leading-relaxed">
              &ldquo;How to showcase my skill?&rdquo;
            </p>
          </div>
        </div>

        <div
          onClick={() => setShowMessages(true)}
          className="flex-1 p-5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-primary-light/30 rounded-2xl cursor-pointer transition-all duration-200 group"
        >
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-dark/50 flex items-center justify-center mb-3 group-hover:bg-primary-dark/70 transition-colors">
              <UserSearch className="w-5 h-5 text-primary-light" />
            </div>
            <h3 className="!text-base !font-semibold !text-white">
              Hire Freelancer
            </h3>
          </div>
          <div className="space-y-2.5">
            <p className="!text-[13px] !text-white/40 leading-relaxed">
              &ldquo;How do I post a project on the platform?&rdquo;
            </p>
            <p className="!text-[13px] !text-white/40 leading-relaxed">
              &ldquo;What types of services are available?&rdquo;
            </p>
            <p className="!text-[13px] !text-white/40 leading-relaxed">
              &ldquo;Help me find a freelancer of XX&rdquo;
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatStarter;
