"use client";

import { useState, useEffect } from "react";
import {
  ScheduleEvent,
  ScheduleDomain,
  RecurrenceType,
  CreateScheduleEventRequest,
  UpdateScheduleEventRequest,
} from "@/types";
import { format, parseISO } from "date-fns";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Repeat,
  FileText,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface EventDetailCardProps {
  event: ScheduleEvent | null;
  selectedDate: Date | null;
  onClose: () => void;
  onCreate: (event: CreateScheduleEventRequest) => Promise<void>;
  onUpdate: (
    eventId: string,
    event: UpdateScheduleEventRequest
  ) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  conflicts?: ScheduleEvent[];
}

const domainOptions: { value: ScheduleDomain; label: string; color: string }[] =
  [
    { value: "Personal", label: "Personal", color: "bg-blue-500" },
    { value: "Family", label: "Family", color: "bg-pink-500" },
    { value: "Working", label: "Working", color: "bg-gray-500" },
    { value: "University", label: "University", color: "bg-purple-500" },
    { value: "Health", label: "Health", color: "bg-green-500" },
    { value: "Social", label: "Social", color: "bg-orange-500" },
    { value: "Coding", label: "Coding", color: "bg-teal-500" },
    { value: "Holidays", label: "Holidays", color: "bg-red-500" },
  ];

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export function EventDetailCard({
  event,
  selectedDate,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  conflicts = [],
}: EventDetailCardProps) {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<ScheduleDomain>("Personal");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form when event or selectedDate changes
  useEffect(() => {
    if (event) {
      // Edit mode
      setTitle(event.title);
      setDomain(event.domain);
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);
      setStartDate(format(start, "yyyy-MM-dd"));
      setStartTime(format(start, "HH:mm"));
      setEndDate(format(end, "yyyy-MM-dd"));
      setEndTime(format(end, "HH:mm"));
      setIsAllDay(event.isAllDay);
      setLocation(event.location || "");
      setDescription(event.description || "");
      setRecurrenceType(event.recurrence);
      setRecurrenceEndDate(event.recurrenceEndDate || "");
    } else if (selectedDate) {
      // Create mode with selected date
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setTitle("");
      setDomain("Personal");
      setStartDate(dateStr);
      setStartTime("09:00");
      setEndDate(dateStr);
      setEndTime("10:00");
      setIsAllDay(false);
      setLocation("");
      setDescription("");
      setRecurrenceType("none");
      setRecurrenceEndDate("");
    } else {
      // Reset
      resetForm();
    }
    setShowDeleteConfirm(false);
  }, [event, selectedDate]);

  const resetForm = () => {
    setTitle("");
    setDomain("Personal");
    setStartDate("");
    setStartTime("09:00");
    setEndDate("");
    setEndTime("10:00");
    setIsAllDay(false);
    setLocation("");
    setDescription("");
    setRecurrenceType("none");
    setRecurrenceEndDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const eventData = {
        title,
        domain,
        startDate: isAllDay
          ? `${startDate}T00:00:00Z`
          : `${startDate}T${startTime}:00Z`,
        endDate: isAllDay
          ? `${endDate}T23:59:59Z`
          : `${endDate}T${endTime}:00Z`,
        isAllDay,
        location: location || undefined,
        description: description || undefined,
        recurrence: recurrenceType,
        recurrenceEndDate:
          recurrenceType !== "none" && recurrenceEndDate
            ? `${recurrenceEndDate}T23:59:59Z`
            : undefined,
      };

      if (event) {
        await onUpdate(event.id, eventData);
      } else {
        await onCreate(eventData);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    setIsLoading(true);
    try {
      await onDelete(event.id);
      resetForm();
      onClose();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormVisible = event || selectedDate;

  return (
    <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
      {!isFormVisible ? (
        <div className="text-center text-muted-foreground py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Event Details</h3>
          <p className="text-sm">
            Click on a date or event to view/edit details
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {event ? "Edit Event" : "New Event"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conflicts Warning */}
          {conflicts.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500 mb-1">
                  Schedule Conflict
                </p>
                <p className="text-muted-foreground">
                  This event overlaps with {conflicts.length} other event
                  {conflicts.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title..."
              className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium mb-2">Domain *</label>
            <div className="grid grid-cols-2 gap-2">
              {domainOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDomain(option.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    domain === option.value
                      ? `${option.color} text-white border-transparent`
                      : "bg-background border-muted-foreground/20 hover:border-muted-foreground/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsAllDay(!isAllDay)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                isAllDay
                  ? "bg-primary border-primary"
                  : "border-muted-foreground"
              }`}
            >
              {isAllDay && (
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
            </div>
            <label
              className="text-sm font-medium cursor-pointer"
              onClick={() => setIsAllDay(!isAllDay)}
            >
              All day event
            </label>
          </div>

          {/* Start Date/Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start *
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {!isAllDay && (
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-32 px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              )}
            </div>
          </div>

          {/* End Date/Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              End *
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {!isAllDay && (
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-32 px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location..."
              className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Repeat className="w-4 h-4 inline mr-1" />
              Repeat
            </label>
            <select
              value={recurrenceType}
              onChange={(e) =>
                setRecurrenceType(e.target.value as RecurrenceType)
              }
              className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {recurrenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Recurrence End Date */}
          {recurrenceType !== "none" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Repeat until
              </label>
              <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : event ? "Update" : "Create"}
            </button>

            {event && (
              <>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Event
                  </button>
                ) : (
                  <div className="space-y-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-500 font-medium">
                      Are you sure you want to delete this event?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      )}
    </aside>
  );
}
