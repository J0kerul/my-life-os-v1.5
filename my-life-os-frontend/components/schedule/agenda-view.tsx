"use client";

import { useEventStore } from "@/lib/store/event-store";
import { format, isSameDay, parseISO, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";

export function AgendaView() {
  const { events, selectEvent, currentDate } = useEventStore();

  // Group events by date
  const groupedEvents: Record<string, typeof events> = {};

  events.forEach((event) => {
    // Skip events hidden from agenda
    if (event.hideFromAgenda) return;

    const eventDate = startOfDay(parseISO(event.startDate));
    const dateKey = format(eventDate, "yyyy-MM-dd");

    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();

  // Domain colors
  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      Work: "border-blue-500",
      University: "border-purple-500",
      Personal: "border-green-500",
      "Coding Time": "border-cyan-500",
      Study: "border-indigo-500",
      Health: "border-pink-500",
      Social: "border-yellow-500",
      Holidays: "border-red-500",
      Travel: "border-orange-500",
      Maintenance: "border-gray-500",
      Entertainment: "border-fuchsia-500",
      Family: "border-emerald-500",
    };
    return colors[domain] || "border-primary";
  };

  if (sortedDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <Calendar className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No Events</h3>
        <p className="text-sm">No events scheduled for the next 30 days</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto space-y-6 p-4">
      {sortedDates.map((dateKey) => {
        const date = parseISO(dateKey);
        const dayEvents = groupedEvents[dateKey];
        const isToday = isSameDay(date, new Date());

        return (
          <div key={dateKey} className="space-y-3">
            {/* Date Header */}
            <div
              className={`sticky top-0 bg-card z-10 py-2 border-b border-border ${
                isToday ? "border-primary" : ""
              }`}
            >
              <h3 className={`font-semibold ${isToday ? "text-primary" : ""}`}>
                {format(date, "EEEE, MMMM d, yyyy")}
                {isToday && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    Today
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Events for this day */}
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => selectEvent(event)}
                  className={`w-full text-left p-4 bg-card border-l-4 ${getDomainColor(
                    event.domain
                  )} rounded-lg hover:bg-accent transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{event.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>
                          {event.allDay
                            ? "All Day"
                            : `${format(parseISO(event.startDate), "HH:mm")}${
                                event.endDate
                                  ? ` - ${format(
                                      parseISO(event.endDate),
                                      "HH:mm"
                                    )}`
                                  : ""
                              }`}
                        </span>
                        <span>•</span>
                        <span>{event.domain}</span>
                        {event.isRecurring && (
                          <>
                            <span>•</span>
                            <span className="capitalize">
                              🔁 {event.recurrenceType}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
