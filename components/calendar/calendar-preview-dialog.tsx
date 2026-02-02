"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type Calendar from "@/schemas/Calendar";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Calendar as CalendarIcon, Clock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface CalendarPreviewDialogProps {
  event: Calendar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendarPreviewDialog({
  event,
  open,
  onOpenChange,
}: CalendarPreviewDialogProps) {
  const router = useRouter();

  if (!event) return null;

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Event":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Task":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Schedule":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarIcon className="h-5 w-5" />
            Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="text-2xl font-bold text-gray-900">
                {event.title}
              </h4>
              <div className="flex gap-2">
                <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <CalendarIcon className="h-4 w-4 text-gray-500" />

              <div>{formatDate(event.date)}</div>
            </div>

            <div className="flex gap-1 items-center text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-500" />

              <div>{event.time}</div>
            </div>
          </div>

          {event.description && (
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <FileText className="text-xl text-gray-500 mt-0.5" />

              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {event.note && (
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium mb-2">Notes</div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {event.note}
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await apiClient.delete(`/calendars/${event._id}`);
                toast.success("Event deleted successfully!");
                router.refresh();
                onOpenChange(false);
              } catch (error) {
                if (error instanceof AxiosError && error.response) {
                  toast.error(error.response.data.message);
                } else {
                  toast.error("Something went wrong!");
                }
              }
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
