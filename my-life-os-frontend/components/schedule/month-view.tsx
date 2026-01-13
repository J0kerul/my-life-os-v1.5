"use client";

import { useEventStore } from "@/lib/store/event-store";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

export function MonthView() {
  const { events, currentDate, selectEvent } = useEventStore();

  // Get all days to display (including prev/next month days)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get first day of the week for the month (Monday = 1)
  const firstDayOfWeek = monthStart.getDay();
  const startDay = new Date(monthStart);
  startDay.setDate(
    startDay.getDate() - (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)
  );

  // Get last day to show (always show 6 weeks)
  const endDay = new Date(startDay);
  endDay.setDate(endDay.getDate() + 41); // 6 weeks = 42 days

  const days = eachDayOfInterval({ start: startDay, end: endDay });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  // Domain colors for event badges
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

  return (
    <div className="h-full flex flex-col">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-px bg-border mb-px">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="bg-card p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 gap-px bg-border overflow-auto">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={idx}
              className={`bg-card p-2 min-h-[100px] ${
                !isCurrentMonth ? "opacity-40" : ""
              }`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    isDayToday
                      ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => selectEvent(event)}
                    className={`w-full text-left px-2 py-0.5 rounded text-xs truncate ${getDomainColor(
                      event.domain
                    )} text-white hover:opacity-80 transition-opacity`}
                  >
                    {event.allDay ? "📅" : "🕐"} {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
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
