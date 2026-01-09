"use client";

import { ScheduleEvent, ScheduleDomain } from "@/types";
import { format, isSameDay, parseISO, isToday, startOfDay } from "date-fns";

interface DayViewProps {
  currentDate: Date;
  events: ScheduleEvent[];
  selectedDomains: Set<ScheduleDomain>;
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

export function DayView({
  currentDate,
  events,
  selectedDomains,
  onEventClick,
}: DayViewProps) {
  // Filter events by selected domains and current day
  const filteredEvents = events.filter((event) => {
    if (selectedDomains.size > 0 && !selectedDomains.has(event.domain)) {
      return false;
    }

    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);

    return (
      isSameDay(eventStart, currentDate) ||
      (currentDate >= eventStart && currentDate <= eventEnd && event.isAllDay)
    );
  });

  const getAllDayEvents = () => {
    return filteredEvents.filter((event) => {
      if (!event.isAllDay) return false;

      // For all-day events, compare date strings to avoid timezone issues
      const eventDateStr = event.startDate.split("T")[0]; // "2026-01-08"
      const checkDateStr = format(currentDate, "yyyy-MM-dd");
      return eventDateStr === checkDateStr;
    });
  };

  const getEventsForTimeSlot = (hour: number) => {
    return filteredEvents.filter((event) => {
      if (event.isAllDay) return false;

      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);

      const eventHour = eventStart.getHours();
      const eventEndHour = eventEnd.getHours();

      return eventHour <= hour && hour < eventEndHour;
    });
  };

  const isCurrentDay = isToday(currentDate);

  return (
    <div className="bg-card border-2 border-muted-foreground/20 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header - Sticky */}
        <div className="border-b border-muted-foreground/20 sticky top-0 z-20 bg-card">
          <div
            className={`p-4 text-center ${
              isCurrentDay ? "bg-primary/10" : "bg-muted/30"
            }`}
          >
            <div className="text-sm text-muted-foreground font-medium">
              {format(currentDate, "EEEE")}
            </div>
            <div
              className={`text-3xl font-bold mt-1 ${
                isCurrentDay
                  ? "inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {format(currentDate, "d")}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {format(currentDate, "MMMM yyyy")}
            </div>
          </div>
        </div>

        {/* All-Day Events Section - Sticky below header */}
        {getAllDayEvents().length > 0 && (
          <div className="border-b border-muted-foreground/20 sticky top-[121px] z-10 bg-card">
            <div className="p-4 bg-muted/10">
              <div className="text-xs text-muted-foreground font-medium mb-2">
                All Day
              </div>
              <div className="space-y-2">
                {getAllDayEvents().map((event) => (
                  <div
                    key={`${event.id}-${event.startDate}`}
                    onClick={() => onEventClick(event)}
                    className={`px-3 py-2 rounded border cursor-pointer hover:opacity-80 transition-opacity ${
                      domainColors[event.domain]
                    } ${event.domain === "Holidays" ? "opacity-40" : ""}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-xs opacity-80 mt-1 truncate">
                        {event.description}
                      </div>
                    )}
                    {event.location && (
                      <div className="text-xs opacity-80 mt-1">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Time Grid */}
        <div className="divide-y divide-muted-foreground/20">
          {hours.map((hour) => {
            const timeSlotEvents = getEventsForTimeSlot(hour);
            return (
              <div key={hour} className="flex min-h-[80px]">
                {/* Time Label */}
                <div className="w-20 p-3 text-right text-xs text-muted-foreground bg-muted/10 flex-shrink-0">
                  {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
                </div>

                {/* Events Area */}
                <div className="flex-1 p-2 hover:bg-muted/5 cursor-pointer transition-colors">
                  {timeSlotEvents.length > 0 && (
                    <div className="space-y-2">
                      {timeSlotEvents.map((event) => (
                        <div
                          key={`${event.id}-${event.startDate}`}
                          onClick={() => onEventClick(event)}
                          className={`px-3 py-2 rounded border cursor-pointer hover:opacity-80 transition-opacity ${
                            domainColors[event.domain]
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-medium">{event.title}</div>
                              <div className="text-xs opacity-80 mt-1">
                                {format(parseISO(event.startDate), "HH:mm")} -{" "}
                                {format(parseISO(event.endDate), "HH:mm")}
                              </div>
                              {event.location && (
                                <div className="text-xs opacity-80 mt-1">
                                  📍 {event.location}
                                </div>
                              )}
                              {event.description && (
                                <div className="text-xs opacity-80 mt-1 line-clamp-2">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
