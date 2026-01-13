"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useEventStore } from "@/lib/store/event-store";
import type { CreateEventRequest, EventDomain, RecurrenceType } from "@/types";

interface QuickAddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDate?: string; // YYYY-MM-DD
  prefilledTime?: string; // HH:mm
}

export function QuickAddEventDialog({
  isOpen,
  onClose,
  prefilledDate,
  prefilledTime,
}: QuickAddEventDialogProps) {
  const { createEvent } = useEventStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    startDate: prefilledDate || "",
    startTime: prefilledTime || "",
    endDate: "",
    endTime: "",
    allDay: false,
    domain: "Personal" as EventDomain,
    isRecurring: false,
    recurrenceType: "daily" as RecurrenceType,
    recurrenceEnd: "",
    recurrenceDays: [] as string[],
    hideFromAgenda: false,
  });

  // Update form when prefilled values change
  useEffect(() => {
    if (prefilledDate) {
      setFormData((prev) => ({ ...prev, startDate: prefilledDate }));
    }
    if (prefilledTime) {
      setFormData((prev) => ({ ...prev, startTime: prefilledTime }));
    }
  }, [prefilledDate, prefilledTime]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      allDay: false,
      domain: "Personal",
      isRecurring: false,
      recurrenceType: "daily",
      recurrenceEnd: "",
      recurrenceDays: [],
      hideFromAgenda: false,
    });
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time
      const startDateTime = formData.allDay
        ? new Date(formData.startDate).toISOString()
        : new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

      const endDateTime = formData.allDay
        ? null
        : formData.endDate && formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
        : null;

      const eventData: CreateEventRequest = {
        title: formData.title,
        startDate: startDateTime,
        endDate: endDateTime,
        allDay: formData.allDay,
        domain: formData.domain,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? formData.recurrenceType : null,
        recurrenceEnd: formData.recurrenceEnd
          ? new Date(formData.recurrenceEnd).toISOString()
          : null,
        recurrenceDays:
          formData.isRecurring && formData.recurrenceType === "weekly"
            ? JSON.stringify(formData.recurrenceDays)
            : null,
        hideFromAgenda: formData.hideFromAgenda,
      };

      await createEvent(eventData);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle weekday for weekly recurrence
  const toggleWeekday = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      recurrenceDays: prev.recurrenceDays.includes(day)
        ? prev.recurrenceDays.filter((d) => d !== day)
        : [...prev.recurrenceDays, day],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Event</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Event title"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <select
              value={formData.domain}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  domain: e.target.value as EventDomain,
                })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Work">Work</option>
              <option value="University">University</option>
              <option value="Personal">Personal</option>
              <option value="Coding Time">Coding Time</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Social">Social</option>
              <option value="Holidays">Holidays</option>
              <option value="Travel">Travel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Family">Family</option>
            </select>
          </div>

          {/* All Day Checkbox */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, allDay: !formData.allDay })
                }
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  formData.allDay
                    ? "bg-primary border-primary"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {formData.allDay && (
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm font-medium">All Day Event</span>
            </label>
          </div>

          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
              />
            </div>
            {!formData.allDay && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                />
              </div>
            )}
          </div>

          {/* End Date/Time (only for non-all-day) */}
          {!formData.allDay && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                />
              </div>
            </div>
          )}

          {/* Recurring & Hide from Agenda - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isRecurring: !formData.isRecurring,
                    })
                  }
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    formData.isRecurring
                      ? "bg-primary border-primary"
                      : "border-muted-foreground hover:border-primary"
                  }`}
                >
                  {formData.isRecurring && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-sm font-medium">Recurring</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      hideFromAgenda: !formData.hideFromAgenda,
                    })
                  }
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    formData.hideFromAgenda
                      ? "bg-primary border-primary"
                      : "border-muted-foreground hover:border-primary"
                  }`}
                >
                  {formData.hideFromAgenda && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-sm font-medium">Hide Agenda</span>
              </label>
            </div>
          </div>

          {/* Recurrence Options */}
          {formData.isRecurring && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Recurrence Type
                </label>
                <select
                  value={formData.recurrenceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrenceType: e.target.value as RecurrenceType,
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Weekly: Select Days */}
              {formData.recurrenceType === "weekly" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Repeat on
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWeekday(day)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          formData.recurrenceDays.includes(day)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recurrence End */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Recurrence (Optional)
                </label>
                <input
                  type="date"
                  value={formData.recurrenceEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, recurrenceEnd: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
