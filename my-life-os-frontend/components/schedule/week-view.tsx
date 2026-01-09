"use client";

import { ScheduleEvent, ScheduleDomain } from "@/types";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isToday,
  startOfDay,
} from "date-fns";

interface WeekViewProps {
  currentDate: Date;
  events: ScheduleEvent[];
  selectedDomains: Set<ScheduleDomain>;
  onDateClick: (date: Date) => void;
  onEventClick: (event: ScheduleEvent) => void;
}

const domainColors: Record<ScheduleDomain, string> = {
  Personal: "bg-blue-500/80 border-blue-600",
  Family: "bg-pink-500/80 border-pink-600",
  Working: "bg-gray-500/80 border-gray-600",
  University: "bg-purple-500/80 border-purple-600",
  Health: "bg-green-500/80 border-green-600",
  Social: "bg-orange-500/80 border-orange-600",
  Coding: "bg-teal-500/80 border-teal-600",
  Holidays: "bg-red-500/30 border-red-600/50",
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({
  currentDate,
  events,
  selectedDomains,
  onDateClick,
  onEventClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter events by selected domains
  const filteredEvents = events.filter(
    (event) => selectedDomains.size === 0 || selectedDomains.has(event.domain)
  );

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter((event) => {
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);

      // Check if event occurs on this day
      return (
        isSameDay(eventStart, day) ||
        (day >= eventStart && day <= eventEnd && event.isAllDay)
      );
    });
  };

  const getEventsForTimeSlot = (day: Date, hour: number) => {
    return filteredEvents.filter((event) => {
      if (event.isAllDay) return false; // All-day events shown separately

      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);

      if (!isSameDay(eventStart, day)) return false;

      const eventHour = eventStart.getHours();
      const eventEndHour = eventEnd.getHours();

      return eventHour <= hour && hour < eventEndHour;
    });
  };

  const getAllDayEvents = (day: Date) => {
    return filteredEvents.filter((event) => {
      if (!event.isAllDay) return false;

      // For all-day events, compare date strings to avoid timezone issues
      const eventDateStr = event.startDate.split("T")[0]; // "2026-01-08"
      const checkDateStr = format(day, "yyyy-MM-dd");
      return eventDateStr === checkDateStr;
    });
  };

  return (
    <div className="bg-card border-2 border-muted-foreground/20 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Scrollable Area with All Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header with Days - Sticky */}
        <div className="grid grid-cols-8 border-b border-muted-foreground/20 sticky top-0 z-20 bg-card">
          <div className="p-2 text-xs text-muted-foreground text-right bg-muted/30">
            Time
          </div>
          {days.map((day) => {
            const isCurrentDay = isToday(day);
            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateClick(day)}
                className={`p-3 text-center border-l border-muted-foreground/20 cursor-pointer hover:bg-muted/20 transition-colors ${
                  isCurrentDay ? "bg-primary/10" : "bg-muted/30"
                }`}
              >
                <div className="text-xs text-muted-foreground font-medium">
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-lg font-semibold mt-1 ${
                    isCurrentDay
                      ? "inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* All-Day Events Row - Sticky below header */}
        <div className="grid grid-cols-8 border-b border-muted-foreground/20 sticky top-[73px] z-10 bg-card">
          <div className="p-2 text-xs text-muted-foreground text-right bg-muted/30">
            All Day
          </div>
          {days.map((day) => {
            const allDayEvents = getAllDayEvents(day);
            return (
              <div
                key={`allday-${day.toISOString()}`}
                className="border-l border-muted-foreground/20 p-1 min-h-[60px] bg-muted/10"
              >
                <div className="space-y-1">
                  {allDayEvents.slice(0, 2).map((event) => (
                    <div
                      key={`${event.id}-${event.startDate}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`text-xs px-2 py-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${
                        domainColors[event.domain]
                      } ${event.domain === "Holidays" ? "opacity-40" : ""}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {allDayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{allDayEvents.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Time Label */}
              <div className="p-2 text-xs text-muted-foreground text-right border-b border-muted-foreground/20 bg-muted/10">
                {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const timeSlotEvents = getEventsForTimeSlot(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    onClick={() => onDateClick(day)}
                    className="border-l border-b border-muted-foreground/20 p-1 min-h-[60px] hover:bg-muted/10 cursor-pointer transition-colors"
                  >
                    {timeSlotEvents.length > 0 && (
                      <div className="space-y-1">
                        {timeSlotEvents.slice(0, 1).map((event) => (
                          <div
                            key={`${event.id}-${event.startDate}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                            className={`text-xs px-2 py-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${
                              domainColors[event.domain]
                            }`}
                            title={`${event.title} - ${format(
                              parseISO(event.startDate),
                              "HH:mm"
                            )} to ${format(parseISO(event.endDate), "HH:mm")}`}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-[10px] opacity-80">
                              {format(parseISO(event.startDate), "HH:mm")}
                            </div>
                          </div>
                        ))}
                        {timeSlotEvents.length > 1 && (
                          <div className="text-xs text-muted-foreground px-2">
                            +{timeSlotEvents.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
