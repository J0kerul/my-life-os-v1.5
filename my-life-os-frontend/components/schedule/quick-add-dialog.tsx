"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import type { ScheduleDomain } from "@/types";
import { format } from "date-fns";

interface QuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOMAINS: ScheduleDomain[] = [
  "Personal",
  "Family",
  "Working",
  "University",
  "Health",
  "Social",
  "Coding",
  "Holidays",
];

export function QuickAddDialog({ isOpen, onClose }: QuickAddDialogProps) {
  const { createEvent } = useScheduleStore();
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<ScheduleDomain>("Personal");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [isAllDay, setIsAllDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!startDate) {
      setError("Date is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Build ISO 8601 date strings
      const startDateTime = isAllDay
        ? `${startDate}T00:00:00Z`
        : `${startDate}T${startTime}:00Z`;
      const endDateTime = isAllDay
        ? `${startDate}T23:59:59Z`
        : `${startDate}T${endTime}:00Z`;

      await createEvent({
        title: title.trim(),
        description: description.trim(),
        domain,
        startDate: startDateTime,
        endDate: endDateTime,
        isAllDay,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setStartTime("12:00");
      setEndTime("13:00");
      setIsAllDay(false);
      setDomain("Personal");

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-muted-foreground/20 rounded-lg p-6 z-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">New Event</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter event title..."
              autoFocus
            />
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-2">
              Domain *
            </label>
            <div className="relative">
              <select
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value as ScheduleDomain)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {DOMAINS.map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-background text-foreground"
                  >
                    {d}
                  </option>
                ))}
              </select>
              {/* Custom Arrow */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-2"
            >
              Date *
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark] cursor-pointer"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsAllDay(!isAllDay)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                isAllDay
                  ? "bg-primary border-primary"
                  : "border-muted-foreground hover:border-primary"
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
              htmlFor="isAllDay"
              className="text-sm font-medium cursor-pointer"
              onClick={() => setIsAllDay(!isAllDay)}
            >
              All Day Event
            </label>
          </div>

          {/* Time Fields - Only show if not all day */}
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium mb-2"
                >
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark] cursor-pointer"
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium mb-2"
                >
                  End Time
                </label>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
