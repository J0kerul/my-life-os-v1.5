"use client";

import { useState, useEffect } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Plus,
  ArrowRight,
} from "lucide-react";
import { format, addDays, startOfDay, parseISO, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { QuickAddDialog } from "@/components/schedule/quick-add-dialog";
import type { ScheduleEvent, ScheduleDomain } from "@/types";

interface WeekAheadWidgetProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const domainColors: Record<ScheduleDomain, string> = {
  Personal: "text-blue-500",
  Family: "text-pink-500",
  Working: "text-gray-400",
  University: "text-purple-500",
  Health: "text-green-500",
  Social: "text-orange-500",
  Coding: "text-teal-500",
  Holidays: "text-red-500",
};

export function WeekAheadWidget({
  isExpanded,
  onToggleExpand,
}: WeekAheadWidgetProps) {
  const router = useRouter();
  const { events, fetchEvents } = useScheduleStore();
  const [next7Days, setNext7Days] = useState<Date[]>([]);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    // Generate next 7 days starting from today
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setNext7Days(days);

    // Fetch events for the next 7 days
    const start = today;
    const end = addDays(today, 6);
    fetchEvents(start.toISOString(), end.toISOString());
  }, [fetchEvents]);

  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => {
        const eventDate = parseISO(event.startDate);
        const dayStr = format(day, "yyyy-MM-dd");
        const eventDateStr = format(eventDate, "yyyy-MM-dd");
        return eventDateStr === dayStr;
      })
      .sort((a, b) => {
        // All-day events first, then by time
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return a.startDate.localeCompare(b.startDate);
      });
  };

  const handleNewEvent = () => {
    setIsQuickAddOpen(true);
  };

  const handleFullView = () => {
    router.push("/schedule");
  };

  return (
    <>
      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <CalendarDays className="w-5 h-5 text-purple-500" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-200">Week Ahead</h2>

            {/* Badge - Event count */}
            {!isExpanded && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                {events.length}
              </span>
            )}
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Content - Only visible when expanded */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            {/* First Row - 4 Days */}
            <div className="grid grid-cols-4 gap-4">
              {next7Days.slice(0, 4).map((day) => {
                const dayEvents = getEventsForDay(day);
                const dayLabel = isToday(day)
                  ? `Today, ${format(day, "EEE d", { locale: de })}`
                  : format(day, "EEE, MMM d", { locale: de });

                return (
                  <div key={day.toISOString()} className="space-y-2">
                    <div className="text-sm font-medium text-gray-300">
                      {dayLabel}
                    </div>
                    <div className="h-px bg-border" />
                    <div className="space-y-1.5 min-h-[80px]">
                      {dayEvents.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic">
                          No events
                        </div>
                      ) : (
                        dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={`${event.id}-${event.startDate}`}
                            className="flex items-start gap-1.5 text-xs"
                          >
                            <span
                              className={`mt-0.5 ${domainColors[event.domain]}`}
                            >
                              •
                            </span>
                            <div className="flex-1 truncate">
                              <span className="text-muted-foreground">
                                {event.isAllDay
                                  ? "All Day"
                                  : format(parseISO(event.startDate), "HH:mm")}
                              </span>{" "}
                              <span className="text-gray-300">
                                {event.title}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-muted-foreground italic">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Second Row - 3 Days + Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              {next7Days.slice(4, 7).map((day) => {
                const dayEvents = getEventsForDay(day);
                const dayLabel = format(day, "EEE, MMM d", { locale: de });

                return (
                  <div key={day.toISOString()} className="space-y-2">
                    <div className="text-sm font-medium text-gray-300">
                      {dayLabel}
                    </div>
                    <div className="h-px bg-border" />
                    <div className="space-y-1.5 min-h-[80px]">
                      {dayEvents.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic">
                          No events
                        </div>
                      ) : (
                        dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={`${event.id}-${event.startDate}`}
                            className="flex items-start gap-1.5 text-xs"
                          >
                            <span
                              className={`mt-0.5 ${domainColors[event.domain]}`}
                            >
                              •
                            </span>
                            <div className="flex-1 truncate">
                              <span className="text-muted-foreground">
                                {event.isAllDay
                                  ? "All Day"
                                  : format(parseISO(event.startDate), "HH:mm")}
                              </span>{" "}
                              <span className="text-gray-300">
                                {event.title}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-muted-foreground italic">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Quick Actions Box */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-300">
                  Quick Actions
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2 min-h-[80px]">
                  <button
                    onClick={handleNewEvent}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Event</span>
                  </button>
                  <button
                    onClick={handleFullView}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Full View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
