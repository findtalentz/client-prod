"use client";

import { Button } from "@/components/ui/button";
import Calendar from "@/schemas/Calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import DayView from "./day";
import MonthView from "./month";
import WeekView from "./week";
import CreateCalendarDialog from "./create-calendar-dialog";

type ViewMode = "day" | "week" | "month";

interface Props {
  events: Calendar[];
}

export default function CalendarView({ events }: Props) {
  const [view, setView] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1));
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    if (view === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else if (view === "week") {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const processedEvents = events.map((event) => ({
    ...event,
    date: new Date(event.date),
  }));

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl mb-4 md:mb-6 font-bold">Calendar</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-lg min-w-[200px] text-center">
              {formatDateHeader()}
            </span>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4">
          <CreateCalendarDialog />
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              onClick={() => setView(mode)}
              variant={view === mode ? "default" : "outline"}
              size="sm"
              className={`px-3 md:px-4 py-2 ${
                view === mode ? "bg-primary text-white" : "bg-white"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Views */}
      {view === "day" && (
        <DayView date={currentDate} events={processedEvents} />
      )}
      {view === "week" && (
        <WeekView date={currentDate} events={processedEvents} />
      )}
      {view === "month" && (
        <MonthView date={currentDate} events={processedEvents} />
      )}
    </div>
  );
}
