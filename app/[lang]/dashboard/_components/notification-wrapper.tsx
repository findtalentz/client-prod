import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import Notification from "@/schemas/Notification";
import { Bell } from "lucide-react";
import MarkAllAsRead from "./mark-as-all-read";
import NotificationItem from "./notification-item";

interface Props {
  notifications: Notification[];
}

function NotificationWrapper({ notifications }: Props) {
  const unreadCount = notifications.filter((i) => i.status === "Unread").length;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <MarkAllAsRead unreadCount={unreadCount} />
      </div>

      <div>
        <CardContent className="p-0">
          <div>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-50" />
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}

export default NotificationWrapper;
