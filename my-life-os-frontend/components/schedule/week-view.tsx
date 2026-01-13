"use client";

import { useState } from "react";
import { useEventStore } from "@/lib/store/event-store";
import { QuickAddEventDialog } from "./quick-add-event-dialog";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";

export function WeekView() {
  const { events, currentDate, selectEvent } = useEventStore();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Get week days (Monday to Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get events for a specific day and hour
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      if (event.allDay) return false; // All-day events shown separately

      const eventStart = new Date(event.startDate);
      if (!isSameDay(eventStart, day)) return false;

      const eventHour = eventStart.getHours();
      return eventHour === hour;
    });
  };

  // Get all-day events for a day
  const getAllDayEvents = (day: Date) => {
    return events.filter((event) => {
      if (!event.allDay) return false;
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  // Domain colors
  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      Work: "bg-blue-500",
      University: "bg-purple-500",
      Personal: "bg-green-500",
      "Coding Time": "bg-cyan-500",
      Study: "bg-indigo-500",
      Health: "bg-pink-500",
      Social: "bg-yellow-500",
      Holidays: "bg-red-500",
      Travel: "bg-orange-500",
      Maintenance: "bg-gray-500",
      Entertainment: "bg-fuchsia-500",
      Family: "bg-emerald-500",
    };
    return colors[domain] || "bg-primary";
  };

  const handleSlotClick = (day: Date, hour: number) => {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setSelectedTime(format(new Date().setHours(hour, 0), "HH:mm"));
    setIsQuickAddOpen(true);
  };

  const handleAllDayClick = (day: Date) => {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setSelectedTime("");
    setIsQuickAddOpen(true);
  };

  return (
    <>
      <QuickAddEventDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        prefilledDate={selectedDate}
        prefilledTime={selectedTime}
      />

      <div className="h-full flex flex-col overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 gap-px bg-border border-b border-border">
          <div className="bg-card p-2 text-sm font-medium text-muted-foreground">
            Time
          </div>
          {days.map((day) => {
            const isDayToday = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={`bg-card p-2 text-center ${
                  isDayToday ? "bg-primary/10" : ""
                }`}
              >
                <div className="text-xs text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    isDayToday
                      ? "bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* All-Day Events Row */}
        <div className="grid grid-cols-8 gap-px bg-border border-b border-border">
          <div className="bg-card p-2 text-xs text-muted-foreground">
            All Day
          </div>
          {days.map((day) => {
            const allDayEvents = getAllDayEvents(day);
            return (
              <div
                key={day.toISOString()}
                onClick={() => handleAllDayClick(day)}
                className="bg-card p-1 min-h-[40px] cursor-pointer hover:bg-accent transition-colors"
              >
                {allDayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectEvent(event);
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-xs truncate mb-1 ${getDomainColor(
                      event.domain
                    )} text-white hover:opacity-80 transition-opacity`}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8 gap-px bg-border">
            {hours.map((hour) => (
              <div key={hour} className="contents">
                {/* Hour Label */}
                <div className="bg-card p-2 text-xs text-muted-foreground border-t border-border sticky left-0">
                  {format(new Date().setHours(hour, 0), "HH:mm")}
                </div>

                {/* Hour Cells for Each Day */}
                {days.map((day) => {
                  const hourEvents = getEventsForDayAndHour(day, hour);
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      onClick={() => handleSlotClick(day, hour)}
                      className="bg-card p-1 min-h-[60px] border-t border-border cursor-pointer hover:bg-accent transition-colors"
                    >
                      {hourEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectEvent(event);
                          }}
                          className={`w-full text-left px-2 py-1 rounded text-xs truncate ${getDomainColor(
                            event.domain
                          )} text-white hover:opacity-80 transition-opacity`}
                        >
                          {format(new Date(event.startDate), "HH:mm")}{" "}
                          {event.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
