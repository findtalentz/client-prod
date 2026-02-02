"use client";

import Calendar from "@/schemas/Calendar";

import { useState } from "react";
import { CalendarPreviewDialog } from "./calendar-preview-dialog";
import ItemView from "./item-view";

function DayView({ date, events }: { date: Date; events: Calendar[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Calendar | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  // Parse time from "HH:MM" format to hour number
  const parseHour = (time: string) => {
    const [hours] = time.split(":").map(Number);
    return hours;
  };

  // Group events by hour for better performance
  const eventsByHour: { [hour: number]: Calendar[] } = {};
  dayEvents.forEach((event) => {
    const hour = parseHour(event.time);
    if (hour >= 0 && hour < 24) {
      if (!eventsByHour[hour]) {
        eventsByHour[hour] = [];
      }
      eventsByHour[hour].push(event);
    }
  });

  const handleEventClick = (event: Calendar) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {Array.from({ length: 24 }).map((_, hour) => {
            const timeLabel = `${hour % 12 === 0 ? 12 : hour % 12}${
              hour < 12 ? "AM" : "PM"
            }`;
            const hourEvents = eventsByHour[hour] || [];

            return (
              <div key={hour} className="flex min-h-16">
                <div className="w-20 p-2 text-right border-r">
                  <span className="text-sm text-gray-500">{timeLabel}</span>
                </div>
                <div className="flex-1 p-1">
                  {hourEvents.map((event) => (
                    <ItemView
                      key={event._id}
                      calendar={event}
                      onPreview={handleEventClick}
                    />
                  ))}

                  {/* Show empty state for hours with no events */}
                  {hourEvents.length === 0 && (
                    <div className="h-full p-2 text-transparent">-</div>
                  )}
                </div>
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

export default DayView;
