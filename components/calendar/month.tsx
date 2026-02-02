"use client";

import Calendar from "@/schemas/Calendar";
import { useState } from "react";
import { CalendarPreviewDialog } from "./calendar-preview-dialog";
import ItemView from "./item-view";

function MonthView({ date, events }: { date: Date; events: Calendar[] }) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  const [selectedEvent, setSelectedEvent] = useState<Calendar | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Previous month days
  const prevMonthLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        prevMonthLastDay - i
      ),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(date.getFullYear(), date.getMonth(), i),
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(date.getFullYear(), date.getMonth() + 1, i),
      isCurrentMonth: false,
    });
  }

  // Get events for a specific day
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

  const handleEventClick = (event: Calendar) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Weekdays Header */}
        <div className="grid grid-cols-7 border-b">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="p-3 text-center font-medium text-sm text-gray-600 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayEvents = getDayEvents(day.date);
            const isToday =
              day.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={idx}
                className={`min-h-32 p-2 border-r border-b hover:bg-gray-50 transition-colors ${
                  !day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                } ${idx % 7 === 6 ? "border-r-0" : ""}`}
              >
                {/* Date Number */}
                <div
                  className={`flex items-center justify-between mb-1 ${
                    !day.isCurrentMonth ? "opacity-50" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
                      isToday ? "bg-primary text-white" : "text-gray-700"
                    }`}
                  >
                    {day.date.getDate()}
                  </div>

                  {/* Event count badge */}
                  {dayEvents.length > 0 && day.isCurrentMonth && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full min-w-5 text-center">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <ItemView
                      key={event._id}
                      calendar={event}
                      onPreview={handleEventClick}
                    />
                  ))}

                  {/* Show "more" indicator if there are more events */}
                  {dayEvents.length > 3 && day.isCurrentMonth && (
                    <div className="text-xs text-gray-500 text-center pt-1">
                      +{dayEvents.length - 3} more
                    </div>
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

export default MonthView;
