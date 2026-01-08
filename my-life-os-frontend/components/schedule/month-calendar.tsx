"use client";

import { ScheduleEvent, ScheduleDomain } from "@/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";

interface MonthCalendarProps {
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

export function MonthCalendar({
  currentDate,
  events,
  selectedDomains,
  onDateClick,
  onEventClick,
}: MonthCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Filter events by selected domains and group by date
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

  // Sort events: Holidays first (background), then others
  const sortEvents = (events: ScheduleEvent[]) => {
    return [...events].sort((a, b) => {
      if (a.domain === "Holidays" && b.domain !== "Holidays") return -1;
      if (a.domain !== "Holidays" && b.domain === "Holidays") return 1;
      return a.startDate.localeCompare(b.startDate);
    });
  };

  return (
    <div className="bg-card border-2 border-muted-foreground/20 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 border-b border-muted-foreground/20 flex-shrink-0">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-muted-foreground bg-muted/30"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day) => {
          const dayEvents = sortEvents(getEventsForDay(day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`border-b border-r border-muted-foreground/20 p-2 cursor-pointer transition-colors hover:bg-muted/20 ${
                !isCurrentMonth ? "bg-muted/10" : ""
              }`}
            >
              {/* Day Number */}
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentDay
                    ? "inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground"
                    : isCurrentMonth
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {format(day, "d")}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`text-xs px-1.5 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${
                      domainColors[event.domain]
                    } ${event.domain === "Holidays" ? "opacity-40" : ""}`}
                    title={event.title}
                  >
                    {event.isAllDay
                      ? "📅"
                      : format(parseISO(event.startDate), "HH:mm")}{" "}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
