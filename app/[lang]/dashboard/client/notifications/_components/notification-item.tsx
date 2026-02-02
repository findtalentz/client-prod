"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import Notification, { NotificationType } from "@/schemas/Notification";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { AlertCircle, CheckCircle, Clock, Info, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const getIconByType = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "error":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const router = useRouter();

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-md border-l-4 rounded-lg overflow-hidden",
        notification.status === "Unread"
          ? "bg-linear-to-r from-muted/60 to-background border-l-primary"
          : "bg-card",
        notification.type === "success" && "border-l-green-500",
        notification.type === "warning" && "border-l-yellow-500",
        notification.type === "error" && "border-l-red-500",
        notification.type === "info" && "border-l-blue-500"
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Icon Section */}
          <div className="shrink-0">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                notification.type === "success" && "bg-green-100",
                notification.type === "warning" && "bg-yellow-100",
                notification.type === "error" && "bg-red-100",
                notification.type === "info" && "bg-blue-100"
              )}
            >
              {getIconByType(notification.type)}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                    {notification.title}
                  </h3>
                  {notification.status === "Unread" && (
                    <div className="shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed line-clamp-2">
                  {notification.description}
                </p>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {notification.status === "Unread" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-sm"
                    onClick={async () => {
                      try {
                        await apiClient.put(
                          `/notifications/${notification._id}`
                        );
                        toast.success("Marked as read");
                        router.refresh();
                      } catch (error) {
                        if (error instanceof AxiosError) {
                          toast.error(error.message);
                        }
                      }
                    }}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>

            {/* Metadata Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
              <div className="flex flex-wrap items-center gap-2">
                {/* User Info */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {notification.user.firstName} {notification.user.lastName}
                  </span>
                </div>

                <div className="hidden sm:block w-px h-4 bg-border" />

                {/* Type Badge */}
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border-2",
                    getTypeStyles(notification.type)
                  )}
                >
                  {notification.type}
                </Badge>

                {/* Status Badge */}
                <Badge
                  variant={
                    notification.status === "Unread" ? "default" : "secondary"
                  }
                  className="rounded-full px-3 py-1 text-xs font-medium"
                >
                  {notification.status}
                </Badge>
              </div>

              {/* Date and Mobile Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                {/* Date */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>

                {/* Mobile Actions */}
                <div className="flex sm:hidden items-center gap-2">
                  {notification.status === "Unread" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs rounded-full"
                      onClick={async () => {
                        try {
                          await apiClient.put(
                            `/notifications/${notification._id}`
                          );
                          toast.success("Marked as read");
                          router.refresh();
                          queryClient.invalidateQueries({
                            queryKey: ["notifications"],
                          });
                        } catch (error) {
                          if (error instanceof AxiosError) {
                            toast.error(error.message);
                          }
                        }
                      }}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
