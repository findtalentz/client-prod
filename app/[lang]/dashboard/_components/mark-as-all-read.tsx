"use client";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { queryClient } from "../../query-client-provider";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

interface Props {
  unreadCount: number;
}

function MarkAllAsRead({ unreadCount }: Props) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await apiClient.post("/notifications/all-read");
      toast.success("Done");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      router.refresh();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button onClick={markAllAsRead} disabled={unreadCount === 0 || isLoading}>
      {isLoading ? <BeatLoader /> : "Mark all as read"}
    </Button>
  );
}

export default MarkAllAsRead;
