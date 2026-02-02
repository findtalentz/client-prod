"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { Chat } from "@/schemas/Chat";
import apiClient from "@/services/api-client";
import { useChatStore } from "@/store";
import { useRouter } from "next/navigation";

interface Props {
  seller: string;
  label?: string;
  className?: string;
  size?: "lg" | "sm" | "default";
}

export default function MessageSentButton({
  seller,
  label = "Message",
  size = "sm",
  className,
}: Props) {
  const setCurrentChat = useChatStore((s) => s.setCurrentChat);
  const router = useRouter();
  const { data } = useSession();

  if (!data) return null;

  return (
    <Button
      variant="outline"
      size={size}
      className={cn("cursor-pointer", className)}
      onClick={async () => {
        try {
          const { data } = await apiClient.post<Chat>("/chats", {
            seller,
          });
          setCurrentChat(data);
          queryClient.invalidateQueries({
            queryKey: ["chats"],
          });
          router.push("/dashboard/client/messages");
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {label}
    </Button>
  );
}
