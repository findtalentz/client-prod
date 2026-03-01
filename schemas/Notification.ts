export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationCategory =
  | "verification"
  | "order"
  | "delivery"
  | "dispute"
  | "review"
  | "application"
  | "withdrawal"
  | "message"
  | "auth"
  | "general";

export default interface Notification {
  _id: string;
  title: string;
  description: string;
  status: "Read" | "Unread";
  type: NotificationType;
  category?: NotificationCategory;
  actionUrl?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
}