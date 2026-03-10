"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ArrowUp, Loader2, Sparkles, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Markdown from "react-markdown";
import { PulseLoader } from "react-spinners";

import useMessageStore from "@/store";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { v4 as uuidV4 } from "uuid";

interface APIResponse {
  message: string;
}

interface FormData {
  prompt: string;
}

const FormSchema = Joi.object({
  prompt: Joi.string().trim().min(1).max(1000).required().label("Prompt"),
});

export default function AiChatBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    addMessage,
    userId,
    setUserId,
    setBotTyping,
    setShowMessages,
    isBotTyping,
    showMessages,
    clearMessages,
  } = useMessageStore();

  const notificationAudio = useRef<HTMLAudioElement | null>(null);
  const popAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationAudio.current = new Audio("/sounds/notification.mp3");
    notificationAudio.current.volume = 0.2;
    popAudio.current = new Audio("/sounds/pop.mp3");
    popAudio.current.volume = 0.2;
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserId(uuidV4());
    }
  }, [userId, setUserId]);

  useEffect(() => {
    if (open && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: { prompt: "" },
    resolver: joiResolver(FormSchema),
  });

  const onSubmit = async ({ prompt }: FormData) => {
    setBotTyping(true);
    setShowMessages(true);
    try {
      addMessage(prompt, false);
      popAudio.current?.play();
      reset();
      const { data } = await apiClient.post<APIResponse>("/chatbot", {
        prompt,
        conversationId: userId,
      });
      addMessage(data.message, true);
      notificationAudio.current?.play();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setBotTyping(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  // Hide on the full AI chat page
  if (pathname.includes("/chat")) return null;

  return (
    <>
      {/* Popup chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-gradient-to-b from-[#0a2e25] to-[#061a14] border border-primary-light/20 rounded-2xl shadow-2xl shadow-primary-dark/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-dark/80 flex items-center justify-center">
                <Image
                  src="/logo_icon.png"
                  width={18}
                  height={18}
                  alt="TalentzAI"
                  className="w-[18px] h-[18px]"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white">TalentzAI</p>
                <p className="text-[11px] text-white/40">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {!showMessages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light/10 border border-primary-light/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-primary-light" />
                  <span className="text-xs font-medium text-primary-light">TalentzAI</span>
                </div>
                <p className="text-white text-sm font-medium mb-1">How can I help you?</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Ask about finding jobs, hiring freelancers, or anything about Talentz.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      !message.isBotReply && "self-end flex-row-reverse ml-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5",
                        message.isBotReply ? "bg-primary-dark/80" : "bg-white/15"
                      )}
                    >
                      {message.isBotReply ? (
                        <Image
                          src="/logo_icon.png"
                          width={14}
                          height={14}
                          alt="TalentzAI"
                          className="w-[14px] h-[14px]"
                        />
                      ) : (
                        <User className="w-3 h-3 text-white/70" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs leading-relaxed",
                        message.isBotReply
                          ? "bg-white/[0.07] text-white/90 border border-white/[0.06] rounded-tl-sm"
                          : "bg-primary text-white rounded-tr-sm",
                        message.isBotReply &&
                          "[&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-3 [&_ul]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-3 [&_ol]:mb-1.5 [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[11px] [&_a]:text-primary-light [&_a]:underline"
                      )}
                    >
                      <Markdown>{message.message}</Markdown>
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary-dark/80 flex items-center justify-center">
                      <Image
                        src="/logo_icon.png"
                        width={14}
                        height={14}
                        alt="TalentzAI"
                        className="w-[14px] h-[14px]"
                      />
                    </div>
                    <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-white/[0.07] border border-white/[0.06]">
                      <PulseLoader size={5} color="rgba(255,255,255,0.4)" speedMultiplier={0.8} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={onKeyDown}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  "flex-1 flex items-center bg-white/[0.08] border border-white/[0.1] rounded-full h-10 px-3 transition-all duration-200 focus-within:border-primary-light/40 focus-within:bg-white/[0.12]",
                  errors?.prompt && "border-red-500/50"
                )}
              >
                <input
                  {...register("prompt", {
                    required: true,
                    setValueAs: (val) => val.trim(),
                  })}
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 h-full bg-transparent text-xs text-white placeholder:text-white/30 border-none focus:outline-none"
                  disabled={isBotTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!isValid || isBotTyping}
                className={cn(
                  "w-8 h-8 shrink-0 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
                  isValid && !isBotTyping
                    ? "bg-primary-light text-[#0a2e25] hover:bg-primary-light/90 shadow-lg shadow-primary-light/20"
                    : "bg-white/10 text-white/30"
                )}
              >
                {isBotTyping ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer",
          open
            ? "bg-white/10 border border-white/20 hover:bg-white/20"
            : "bg-gradient-to-br from-primary to-primary-dark hover:from-primary-light hover:to-primary shadow-primary/30 hover:shadow-primary/50"
        )}
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </button>
    </>
  );
}
