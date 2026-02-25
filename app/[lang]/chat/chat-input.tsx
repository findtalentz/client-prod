"use client";

import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ArrowUp, Loader2 } from "lucide-react";

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

function ChatInput() {
  const { addMessage, userId, setBotTyping, setShowMessages, isBotTyping } =
    useMessageStore();

  const notificationAudio = useRef<HTMLAudioElement | null>(null);
  const popAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationAudio.current = new Audio("/sounds/notification.mp3");
    notificationAudio.current.volume = 0.2;

    popAudio.current = new Audio("/sounds/pop.mp3");
    popAudio.current.volume = 0.2;
  }, []);

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      className="flex items-center gap-3 w-full md:px-16 px-4 mt-2"
    >
      <div
        className={cn(
          "flex-1 flex items-center bg-white/[0.08] border border-white/[0.1] rounded-full h-12 px-4 transition-all duration-200 focus-within:border-primary-light/40 focus-within:bg-white/[0.12]",
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
          className="flex-1 h-full bg-transparent text-sm text-white placeholder:text-white/30 border-none focus:outline-none"
          disabled={isBotTyping}
        />
      </div>
      <button
        type="submit"
        disabled={!isValid || isBotTyping}
        className={cn(
          "w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
          isValid && !isBotTyping
            ? "bg-primary-light text-[#0a2e25] hover:bg-primary-light/90 shadow-lg shadow-primary-light/20"
            : "bg-white/10 text-white/30"
        )}
      >
        {isBotTyping ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}

export default ChatInput;
