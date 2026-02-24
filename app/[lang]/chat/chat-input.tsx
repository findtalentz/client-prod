"use client";

import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { LuSendHorizontal } from "react-icons/lu";

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
  const { addMessage, userId, setBotTyping, setShowMessages } =
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
      className="flex items-center justify-between gap-4 w-full md:px-20 px-4 mt-6"
    >
      <div
        className={cn(
          "flex-1 border-primary-light bg-white/10 rounded-full h-[45px] flex items-center justify-center px-2",
          errors && errors.prompt && "border-red-500"
        )}
      >
        <input
          {...register("prompt", {
            required: true,
            setValueAs: (val) => val.trim(),
          })}
          type="text"
          placeholder="Ask me anything..."
          className="text-white flex-1 h-full border-none focus:outline-none px-2"
        />
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="bg-primary-dark text-white w-[45px] h-[45px] flex items-center justify-center rounded-full"
      >
        <LuSendHorizontal className="md:text-xl" />
      </button>
    </form>
  );
}

export default ChatInput;
