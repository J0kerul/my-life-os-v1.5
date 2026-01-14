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

          {/* Domain, Date, Time - 3 Columns */}
          <div className="grid grid-cols-3 gap-4">
            {/* Domain */}
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
                <Tag className="w-3 h-3" />
                Domain
              </label>
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                {event.domain}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />
                Date
              </label>
              <div className="text-sm">
                {format(new Date(event.startDate), "MMM d")}
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
                <Clock className="w-3 h-3" />
                Time
              </label>
              <div className="text-sm">
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

          {/* Timestamps */}
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span>
                <div className="mt-0.5">
                  {format(new Date(event.createdAt), "PPp")}
                </div>
              </div>
              <div>
                <span className="font-medium">Updated:</span>
                <div className="mt-0.5">
                  {format(new Date(event.updatedAt), "PPp")}
                </div>
              </div>
            </div>
          </div>

          {/* View Full Details Button */}
          <button
            onClick={() => {
              selectEvent(event);
              onClose();
              // Navigate to schedule page would be nice but we're in a modal
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
