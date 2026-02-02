"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  unreadCount: number;
}

function MarkAllAsRead({ unreadCount }: Props) {
  const router = useRouter();
  const markAllAsRead = async () => {
    try {
      await apiClient.post("/notifications/all-read");
      toast.success("Done");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return (
    <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
      Mark all as read
    </Button>
  );
}

export default MarkAllAsRead;
