"use client";

import Calendar from "@/schemas/Calendar";
import { useState } from "react";
import { CalendarPreviewDialog } from "./calendar-preview-dialog";
import ItemView from "./item-view";

function WeekView({ date, events }: { date: Date; events: Calendar[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Calendar | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    return day;
  });

  // Get events for each day
  const getDayEvents = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Sort events by time
  const sortEventsByTime = (events: Calendar[]) => {
    return events.sort((a, b) => {
      const timeA = a.time.split(":").map(Number);
      const timeB = b.time.split(":").map(Number);
      return timeA[0] - timeB[0] || timeA[1] - timeB[1];
    });
  };

  const handleEventClick = (event: Calendar) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-7 border-b">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="p-3 text-center border-r last:border-r-0"
            >
              <div className="text-sm text-gray-500 font-medium">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                  day.toDateString() === new Date().toDateString()
                    ? "bg-primary text-white"
                    : "text-gray-700"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week Body */}
        <div className="grid grid-cols-7 divide-x">
          {days.map((day) => {
            const dayEvents = sortEventsByTime(getDayEvents(day));

            return (
              <div key={day.toISOString()} className="min-h-96 p-2">
                {dayEvents.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-4">
                    No events
                  </div>
                ) : (
                  dayEvents.map((event) => (
                    <ItemView
                      key={event._id}
                      calendar={event}
                      onPreview={handleEventClick}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
      <CalendarPreviewDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

export default WeekView;
