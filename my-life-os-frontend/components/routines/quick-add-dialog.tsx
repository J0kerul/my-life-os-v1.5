"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRoutineStore } from "@/lib/store/routine-store";
import type { RoutineFrequency, RoutineTimeType } from "@/types";

interface QuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREQUENCIES: RoutineFrequency[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];
const TIME_TYPES: RoutineTimeType[] = ["AM", "PM", "AllDay", "Specific"];

const TIME_TYPE_LABELS = {
  AM: "Morgens",
  PM: "Abends",
  AllDay: "Ganztags",
  Specific: "Bestimmte Zeit",
};

const WEEKDAYS = [
  { value: 0, label: "Sonntag" },
  { value: 1, label: "Montag" },
  { value: 2, label: "Dienstag" },
  { value: 3, label: "Mittwoch" },
  { value: 4, label: "Donnerstag" },
  { value: 5, label: "Freitag" },
  { value: 6, label: "Samstag" },
];

const MONTHS = [
  { value: 1, label: "Januar" },
  { value: 2, label: "Februar" },
  { value: 3, label: "März" },
  { value: 4, label: "April" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Dezember" },
];

export function QuickAddDialog({ isOpen, onClose }: QuickAddDialogProps) {
  const { createRoutine } = useRoutineStore();
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<RoutineFrequency>("Daily");
  const [weekday, setWeekday] = useState<number>(1);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [quarterlyDay, setQuarterlyDay] = useState<number>(1);
  const [yearlyMonth, setYearlyMonth] = useState<number>(1);
  const [yearlyDay, setYearlyDay] = useState<number>(1);
  const [timeType, setTimeType] = useState<RoutineTimeType>("AM");
  const [specificTime, setSpecificTime] = useState("");
  const [isSkippable, setIsSkippable] = useState(false);
  const [showStreak, setShowStreak] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (timeType === "Specific" && !specificTime) {
      setError("Specific time is required when time type is 'Bestimmte Zeit'");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Build request data
      const requestData: any = {
        title: title.trim(),
        frequency,
        isSkippable,
        showStreak,
        timeType,
        specificTime: timeType === "Specific" ? specificTime : undefined,
      };

      // Add frequency-specific fields
      switch (frequency) {
        case "Weekly":
          requestData.weekday = weekday;
          break;
        case "Monthly":
          requestData.dayOfMonth = dayOfMonth;
          break;
        case "Quarterly":
          requestData.quarterlyDay = quarterlyDay;
          break;
        case "Yearly":
          requestData.yearlyDate = { month: yearlyMonth, day: yearlyDay };
          break;
      }

      await createRoutine(requestData);

      // Reset form
      setTitle("");
      setFrequency("Daily");
      setWeekday(1);
      setDayOfMonth(1);
      setQuarterlyDay(1);
      setYearlyMonth(1);
      setYearlyDay(1);
      setTimeType("AM");
      setSpecificTime("");
      setIsSkippable(false);
      setShowStreak(true);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create routine");
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
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-muted-foreground/20 rounded-lg p-6 z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">New Routine</h2>
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
              placeholder="Enter routine title..."
              autoFocus
            />
          </div>

          {/* Frequency */}
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium mb-2"
            >
              Frequency *
            </label>
            <div className="relative">
              <select
                id="frequency"
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as RoutineFrequency)
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {FREQUENCIES.map((f) => (
                  <option
                    key={f}
                    value={f}
                    className="bg-background text-foreground"
                  >
                    {f}
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

          {/* Conditional: Weekly - Weekday */}
          {frequency === "Weekly" && (
            <div>
              <label
                htmlFor="weekday"
                className="block text-sm font-medium mb-2"
              >
                Wochentag *
              </label>
              <div className="relative">
                <select
                  id="weekday"
                  value={weekday}
                  onChange={(e) => setWeekday(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                >
                  {WEEKDAYS.map((w) => (
                    <option
                      key={w.value}
                      value={w.value}
                      className="bg-background text-foreground"
                    >
                      {w.label}
                    </option>
                  ))}
                </select>
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
          )}

          {/* Conditional: Monthly - Day of Month */}
          {frequency === "Monthly" && (
            <div>
              <label
                htmlFor="dayOfMonth"
                className="block text-sm font-medium mb-2"
              >
                Tag im Monat *
              </label>
              <input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Conditional: Quarterly - Quarterly Day */}
          {frequency === "Quarterly" && (
            <div>
              <label
                htmlFor="quarterlyDay"
                className="block text-sm font-medium mb-2"
              >
                Tag im Quartal *
              </label>
              <input
                id="quarterlyDay"
                type="number"
                min="1"
                max="31"
                value={quarterlyDay}
                onChange={(e) => setQuarterlyDay(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tag im Startmonat jedes Quartals (Jan, Apr, Jul, Okt)
              </p>
            </div>
          )}

          {/* Conditional: Yearly - Month + Day */}
          {frequency === "Yearly" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Jährliches Datum *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={yearlyMonth}
                    onChange={(e) => setYearlyMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    {MONTHS.map((m) => (
                      <option
                        key={m.value}
                        value={m.value}
                        className="bg-background text-foreground"
                      >
                        {m.label}
                      </option>
                    ))}
                  </select>
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
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={yearlyDay}
                  onChange={(e) => setYearlyDay(parseInt(e.target.value))}
                  className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tag"
                />
              </div>
            </div>
          )}

          {/* Time Type */}
          <div>
            <label
              htmlFor="timeType"
              className="block text-sm font-medium mb-2"
            >
              Zeit *
            </label>
            <div className="relative">
              <select
                id="timeType"
                value={timeType}
                onChange={(e) => setTimeType(e.target.value as RoutineTimeType)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {TIME_TYPES.map((t) => (
                  <option
                    key={t}
                    value={t}
                    className="bg-background text-foreground"
                  >
                    {TIME_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
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

          {/* Conditional: Specific Time */}
          {timeType === "Specific" && (
            <div>
              <label
                htmlFor="specificTime"
                className="block text-sm font-medium mb-2"
              >
                Uhrzeit *
              </label>
              <input
                id="specificTime"
                type="time"
                value={specificTime}
                onChange={(e) => setSpecificTime(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark] cursor-pointer"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium">Optionen</label>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isSkippable"
                checked={isSkippable}
                onChange={(e) => setIsSkippable(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="isSkippable" className="text-sm cursor-pointer">
                Skippable (Streak bleibt erhalten)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showStreak"
                checked={showStreak}
                onChange={(e) => setShowStreak(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="showStreak" className="text-sm cursor-pointer">
                Streak anzeigen
              </label>
            </div>
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
              {isLoading ? "Creating..." : "Create Routine"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
