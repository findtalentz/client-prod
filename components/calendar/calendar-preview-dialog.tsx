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
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  MapPin,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import CreateCalendarDialog from "./create-calendar-dialog";

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
  const [isEditing, setIsEditing] = useState(false);

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

  if (isEditing) {
    return (
      <CreateCalendarDialog
        editEvent={event}
        onClose={() => {
          setIsEditing(false);
          onOpenChange(false);
        }}
      />
    );
  }

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
              {event.isAllDay ? (
                <Badge variant="secondary">All Day</Badge>
              ) : (
                <div>{event.time}</div>
              )}
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{event.location}</span>
            </div>
          )}

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
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await apiClient.delete(`/calendars/${event._id}`);
                toast.success("Event deleted successfully!");
                router.refresh();
                onOpenChange(false);
              } catch (error) {
                handleApiError(error, "Something went wrong!");
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
