"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ArrowUp, Loader2, Sparkles, SquarePen, User } from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";
import { PulseLoader } from "react-spinners";
import { v4 as uuidV4 } from "uuid";

import useMessageStore from "@/store";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";

interface APIResponse {
  message: string;
}

interface FormData {
  prompt: string;
}

const FormSchema = Joi.object({
  prompt: Joi.string().trim().min(1).max(1000).required().label("Prompt"),
});

export default function AiChatPanel() {
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
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const handleNewChat = () => {
    clearMessages();
    setShowMessages(false);
    setUserId(uuidV4());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="h-[68px] flex items-center justify-between px-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Image
              src="/logo_icon.png"
              width={20}
              height={20}
              alt="TalentzAI"
              className="w-5 h-5"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight flex items-center gap-1.5">
              TalentzAI Assistant
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-light/15 text-primary-dark">
                AI
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Always here to help
            </p>
          </div>
        </div>
        {showMessages && messages.length > 0 && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5" />
            New Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30 px-5 py-4">
        {!showMessages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">TalentzAI</span>
            </div>
            <p className="text-gray-700 text-base font-medium mb-1">
              How can I help you today?
            </p>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Ask about finding jobs, hiring freelancers, or anything about using Talentz.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2.5 max-w-[75%]",
                  !message.isBotReply && "ml-auto flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                    message.isBotReply
                      ? "bg-gradient-to-br from-primary to-primary-dark"
                      : "bg-gray-200"
                  )}
                >
                  {message.isBotReply ? (
                    <Image
                      src="/logo_icon.png"
                      width={16}
                      height={16}
                      alt="TalentzAI"
                      className="w-4 h-4"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words",
                    message.isBotReply
                      ? "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-md"
                      : "bg-primary text-white rounded-tr-md",
                    message.isBotReply &&
                      "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_a]:text-primary [&_a]:underline"
                  )}
                >
                  <Markdown>{message.message}</Markdown>
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex gap-2.5 max-w-[75%]">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <Image
                    src="/logo_icon.png"
                    width={16}
                    height={16}
                    alt="TalentzAI"
                    className="w-4 h-4"
                  />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-white border border-gray-100 shadow-sm">
                  <PulseLoader size={6} color="rgba(0,0,0,0.3)" speedMultiplier={0.8} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={onKeyDown}
          className="flex items-center gap-2"
        >
          <div
            className={cn(
              "flex-1 flex items-center bg-gray-100 border border-gray-200 rounded-full h-11 px-4 transition-all duration-200 focus-within:border-primary/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10",
              errors?.prompt && "border-red-400"
            )}
          >
            <input
              {...register("prompt", {
                required: true,
                setValueAs: (val) => val.trim(),
              })}
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 h-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 border-none focus:outline-none"
              disabled={isBotTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!isValid || isBotTyping}
            className={cn(
              "w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
              isValid && !isBotTyping
                ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
                : "bg-gray-100 text-gray-300"
            )}
          >
            {isBotTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
