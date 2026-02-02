import ApiResponse from "@/schemas/ApiRespose";
import Notification from "@/schemas/Notification";
import apiClient from "@/services/api-client";
import NotificationWrapper from "../../_components/notification-wrapper";

export default async function NotificationsPage() {
  const { data: notifications } = await apiClient.get<
    ApiResponse<Notification[]>
  >("/notifications");

  return <NotificationWrapper notifications={notifications.data} />;
}
