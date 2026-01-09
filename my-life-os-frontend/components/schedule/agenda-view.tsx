"use client";

import { ScheduleEvent, ScheduleDomain } from "@/types";
import { format, parseISO, startOfDay, addDays } from "date-fns";
import { de } from "date-fns/locale";

interface AgendaViewProps {
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
  Holidays: "bg-red-500/40 border-red-600",
};

export function AgendaView({
  currentDate,
  events,
  selectedDomains,
  onEventClick,
}: AgendaViewProps) {
  // Filter events by selected domains
  const filteredEvents = events.filter(
    (event) => selectedDomains.size === 0 || selectedDomains.has(event.domain)
  );

  // Group events by date (show next 30 days from currentDate)
  const daysToShow = 30;
  const days: { date: Date; events: ScheduleEvent[] }[] = [];

  for (let i = 0; i < daysToShow; i++) {
    const day = addDays(currentDate, i);
    const dayStart = startOfDay(day);
    const dayDateStr = format(dayStart, "yyyy-MM-dd");

    // Get events for this day
    const dayEvents = filteredEvents.filter((event) => {
      const eventDateStr = event.startDate.split("T")[0];
      return eventDateStr === dayDateStr;
    });

    // Only add days that have events
    if (dayEvents.length > 0) {
      // Sort events: all-day first, then by time
      const sortedEvents = [...dayEvents].sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return a.startDate.localeCompare(b.startDate);
      });

      days.push({ date: day, events: sortedEvents });
    }
  }

  return (
    <div className="bg-card border-2 border-muted-foreground/20 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {days.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg font-medium mb-2">Keine Events</p>
            <p className="text-sm">
              Keine Events in den nächsten {daysToShow} Tagen gefunden.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {days.map(({ date, events }) => (
              <div key={date.toISOString()} className="space-y-3">
                {/* Date Header */}
                <div className="sticky top-0 bg-card z-10 pb-2">
                  <h3 className="text-lg font-semibold text-foreground border-b border-muted-foreground/20 pb-2">
                    {format(date, "EEEE, dd. MMMM yyyy", { locale: de })}
                  </h3>
                </div>

                {/* Events for this day */}
                <div className="space-y-2 ml-4">
                  {events.map((event) => (
                    <div
                      key={`${event.id}-${event.startDate}`}
                      onClick={() => onEventClick(event)}
                      className={`p-4 rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity ${
                        domainColors[event.domain]
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Time or All-Day Badge */}
                        <div className="flex-shrink-0 w-20 text-sm font-medium">
                          {event.isAllDay ? (
                            <span className="inline-flex items-center gap-1">
                              📅 Ganztägig
                            </span>
                          ) : (
                            <span>
                              {format(parseISO(event.startDate), "HH:mm")}
                            </span>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1">
                            {event.title}
                          </div>

                          {event.description && (
                            <div className="text-sm opacity-90 mb-2 line-clamp-2">
                              {event.description}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3 text-xs opacity-80">
                            {event.location && (
                              <span className="flex items-center gap-1">
                                📍 {event.location}
                              </span>
                            )}

                            {!event.isAllDay && (
                              <span>
                                bis {format(parseISO(event.endDate), "HH:mm")}
                              </span>
                            )}

                            {event.recurrence !== "none" && (
                              <span className="flex items-center gap-1">
                                🔄{" "}
                                {event.recurrence === "daily"
                                  ? "Täglich"
                                  : event.recurrence === "weekly"
                                  ? "Wöchentlich"
                                  : event.recurrence === "monthly"
                                  ? "Monatlich"
                                  : "Jährlich"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
