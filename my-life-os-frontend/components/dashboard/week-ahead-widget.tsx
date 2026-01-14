"use client";

import { useState, useEffect } from "react";
import { useEventStore } from "@/lib/store/event-store";
import { Calendar, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { format, addDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { QuickAddEventDialog } from "@/components/schedule/quick-add-event-dialog";
import { EventDetailModal } from "@/components/schedule/event-detail-modal";

interface WeekAheadWidgetProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function WeekAheadWidget({
  isExpanded,
  onToggleExpand,
}: WeekAheadWidgetProps) {
  const { events, fetchEvents } = useEventStore();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate next 7 days starting from today
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  // Fetch events for next 7 days on mount
  useEffect(() => {
    const start = startOfDay(today);
    const end = endOfDay(addDays(today, 6));
    fetchEvents(start.toISOString(), end.toISOString());
  }, [fetchEvents]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => isSameDay(new Date(event.startDate), day))
      .sort((a, b) => {
        // All-day events first
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        // Then sort by time
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      });
  };

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

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Widget Card - Full Width */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Icon - Purple Theme */}
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-200">Week Ahead</h2>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Add Button */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Add Event"
            >
              <Plus className="w-5 h-5 text-gray-400" />
            </button>

            {/* Expand/Collapse Button */}
            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4">
            {/* 7-Day Grid */}
            <div className="grid grid-cols-7 gap-3">
              {next7Days.map((day) => {
                const dayEvents = getEventsForDay(day);

                return (
                  <div
                    key={day.toISOString()}
                    className="flex flex-col bg-background border border-border rounded-lg overflow-hidden"
                  >
                    {/* Day Header */}
                    <div className="p-2 text-center border-b border-border">
                      <div className="text-xs font-medium text-muted-foreground">
                        {format(day, "EEE")}
                      </div>
                      <div className="text-lg font-semibold">
                        {format(day, "d")}
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="p-2 space-y-1.5 max-h-[240px] overflow-y-auto">
                      {dayEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-xs">No Events</p>
                          <p className="text-xl">🎉</p>
                        </div>
                      ) : (
                        dayEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => handleEventClick(event.id)}
                            className={`w-full text-left p-2 rounded border-l-4 ${getDomainColor(
                              event.domain
                            )} bg-card hover:bg-accent transition-colors group`}
                          >
                            {/* Time or All-Day Indicator */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                              {event.allDay ? (
                                <>
                                  <span>All Day</span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {format(new Date(event.startDate), "HH:mm")}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Event Title */}
                            <div className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors truncate">
                              {event.title}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        eventId={selectedEventId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEventId(null);
        }}
      />

      {/* Quick Add Dialog */}
      <QuickAddEventDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
}
