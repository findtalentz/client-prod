import socket from "@/lib/socket";
import { NotificationCategory } from "@/schemas/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const CATEGORY_QUERY_MAP: Record<string, string[][]> = {
  verification: [["session"]],
  order: [["my_jobs"], ["jobs"], ["session"], ["balances"], ["pending_earning"]],
  delivery: [
    ["my_jobs"],
    ["comments"],
    ["balances"],
    ["pending_earning"],
    ["total_earning"],
    ["session"],
  ],
  dispute: [["my_jobs"], ["job_disputes"], ["balances"]],
  review: [["seller_reviews"]],
  application: [["applications"], ["jobapplications"]],
  withdrawal: [
    ["my_withdraws"],
    ["balances"],
    ["pending_earning"],
    ["total_earning"],
    ["session"],
    ["myTransactions"],
  ],
  message: [["chats"]],
  auth: [["session"]],
};

export default function useNotificationSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handler = (data?: { category?: NotificationCategory }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      const category = data?.category;
      if (category && CATEGORY_QUERY_MAP[category]) {
        for (const queryKey of CATEGORY_QUERY_MAP[category]) {
          queryClient.invalidateQueries({ queryKey });
        }
      }
    };

    socket.on("new_notification", handler);

    return () => {
      socket.off("new_notification", handler);
    };
  }, [queryClient]);
}
