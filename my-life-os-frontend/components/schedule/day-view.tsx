"use client";

import { useEventStore } from "@/lib/store/event-store";
import { format, isSameDay } from "date-fns";

export function DayView() {
  const { events, currentDate, selectEvent } = useEventStore();

  // Hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      if (event.allDay) return false; // All-day events shown separately

      const eventStart = new Date(event.startDate);
      if (!isSameDay(eventStart, currentDate)) return false;

      const eventHour = eventStart.getHours();
      return eventHour === hour;
    });
  };

  // Get all-day events
  const getAllDayEvents = () => {
    return events.filter((event) => {
      if (!event.allDay) return false;
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, currentDate);
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

  const allDayEvents = getAllDayEvents();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* All-Day Events */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            All Day
          </h3>
          <div className="space-y-2">
            {allDayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => selectEvent(event)}
                className={`w-full text-left px-4 py-2 rounded ${getDomainColor(
                  event.domain
                )} text-white hover:opacity-80 transition-opacity`}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs opacity-90">{event.domain}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Grid */}
      <div className="flex-1 overflow-auto">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);

          return (
            <div
              key={hour}
              className="flex border-b border-border min-h-[80px]"
            >
              {/* Hour Label */}
              <div className="w-20 flex-shrink-0 bg-card p-3 text-sm text-muted-foreground border-r border-border">
                {format(new Date().setHours(hour, 0), "HH:mm")}
              </div>

              {/* Hour Content */}
              <div className="flex-1 bg-card p-2">
                {hourEvents.length > 0 ? (
                  <div className="space-y-2">
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => selectEvent(event)}
                        className={`w-full text-left px-4 py-3 rounded ${getDomainColor(
                          event.domain
                        )} text-white hover:opacity-80 transition-opacity`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {format(new Date(event.startDate), "HH:mm")}
                          {event.endDate &&
                            ` - ${format(new Date(event.endDate), "HH:mm")}`}
                          {" • "}
                          {event.domain}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-full hover:bg-accent/50 rounded transition-colors cursor-pointer" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
