"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type CalendarType from "@/schemas/Calendar";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import CalendarForm from "./calendar-form";

interface CreateCalendarDialogProps {
  editEvent?: CalendarType | null;
  onClose?: () => void;
}

function CreateCalendarDialog({ editEvent, onClose }: CreateCalendarDialogProps) {
  const [isOpen, setIsOpen] = useState(!!editEvent);
  const isEditMode = !!editEvent;

  const handleSuccess = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button>
            <Plus />
            New Event
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-2xl w-full max-h-screen overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Calendar Event" : "Create New Calendar Event"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditMode
              ? "Update the details of your calendar event."
              : "Fill in the details below to create a new calendar event, task, or schedule."}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <CalendarForm onSuccess={handleSuccess} editEvent={editEvent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCalendarDialog;
