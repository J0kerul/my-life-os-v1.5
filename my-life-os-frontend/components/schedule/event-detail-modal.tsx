"use client";

import { useEffect, useState } from "react";
import { X, Calendar, Tag, Clock } from "lucide-react";
import { useEventStore } from "@/lib/store/event-store";
import { format } from "date-fns";

interface EventDetailModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({
  eventId,
  isOpen,
  onClose,
}: EventDetailModalProps) {
  const { events, selectEvent } = useEventStore();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (eventId && isOpen) {
      const foundEvent = events.find((e) => e.id === eventId);
      setEvent(foundEvent || null);
      if (foundEvent) {
        selectEvent(foundEvent);
      }
    }
  }, [eventId, isOpen, events, selectEvent]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-semibold">{event.title}</h3>
          </div>

          {/* Domain, Date, Time - 3 Columns with Icons */}
          <div className="grid grid-cols-3 gap-4">
            {/* Domain */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10">
                <Tag className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-primary">
                {event.domain}
              </div>
            </div>

            {/* Date */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-muted">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">
                {format(new Date(event.startDate), "d. MMM")}
              </div>
            </div>

            {/* Time */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500/10">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-sm font-medium">
                {event.allDay ? (
                  "All Day"
                ) : (
                  <>
                    {format(new Date(event.startDate), "HH:mm")}
                    {event.endDate && (
                      <> - {format(new Date(event.endDate), "HH:mm")}</>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recurrence Info */}
          {event.isRecurring && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Recurrence
              </label>
              <div className="text-sm capitalize">
                🔁 {event.recurrenceType}
                {event.recurrenceEnd && (
                  <span className="text-muted-foreground">
                    {" "}
                    until {format(new Date(event.recurrenceEnd), "PP")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Hide from Agenda */}
          {event.hideFromAgenda && (
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-muted rounded text-sm text-muted-foreground">
                Hidden from Agenda
              </div>
            </div>
          )}

          {/* View Full Details Button */}
          <button
            onClick={() => {
              selectEvent(event);
              onClose();
            }}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}
