export type NotificationType = "info" | "success" | "warning" | "error";

export default interface Notification {
  _id: string;
  title: string;
  description: string;
  status: "Read" | "Unread";
  type: NotificationType;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
}