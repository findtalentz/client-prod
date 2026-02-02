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
import { Plus } from "lucide-react";
import { useState } from "react";
import CalendarForm from "./calendar-from";

function CreateCalendarDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl w-full max-h-screen overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Calendar Event
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details below to create a new calendar event, task, or
            schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <CalendarForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCalendarDialog;
