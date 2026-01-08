"use client";

import { useRoutineStore } from "@/lib/store/routine-store";
import { useState, useEffect } from "react";
import type { RoutineFrequency, RoutineTimeType, YearlyDate } from "@/types";
import {
  Repeat,
  Clock,
  Trash2,
  X,
  Save,
  Flame,
  SkipForward,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const FREQUENCIES: RoutineFrequency[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];
const TIME_TYPES: RoutineTimeType[] = ["AM", "PM", "AllDay", "Specific"];
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

const FREQUENCY_COLORS = {
  Daily: { text: "text-blue-500", bg: "bg-blue-500/10" },
  Weekly: { text: "text-green-500", bg: "bg-green-500/10" },
  Monthly: { text: "text-purple-500", bg: "bg-purple-500/10" },
  Quarterly: { text: "text-orange-500", bg: "bg-orange-500/10" },
  Yearly: { text: "text-pink-500", bg: "bg-pink-500/10" },
};

const TIME_TYPE_LABELS = {
  AM: "Morgens",
  PM: "Abends",
  AllDay: "Ganztags",
  Specific: "Bestimmte Zeit",
};

export function RoutineDetailView() {
  const { selectedRoutine, updateRoutine, deleteRoutine, selectRoutine } =
    useRoutineStore();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editFrequency, setEditFrequency] = useState<RoutineFrequency>("Daily");
  const [editWeekday, setEditWeekday] = useState<number>(1);
  const [editDayOfMonth, setEditDayOfMonth] = useState<number>(1);
  const [editQuarterlyDay, setEditQuarterlyDay] = useState<number>(1);
  const [editYearlyMonth, setEditYearlyMonth] = useState<number>(1);
  const [editYearlyDay, setEditYearlyDay] = useState<number>(1);
  const [editIsSkippable, setEditIsSkippable] = useState(false);
  const [editShowStreak, setEditShowStreak] = useState(false);
  const [editTimeType, setEditTimeType] = useState<RoutineTimeType>("AM");
  const [editSpecificTime, setEditSpecificTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset edit state when selectedRoutine changes
  useEffect(() => {
    if (selectedRoutine) {
      setEditTitle(selectedRoutine.title);
      setEditFrequency(selectedRoutine.frequency);
      setEditWeekday(selectedRoutine.weekday ?? 1);
      setEditDayOfMonth(selectedRoutine.dayOfMonth ?? 1);
      setEditQuarterlyDay(selectedRoutine.quarterlyDay ?? 1);
      setEditYearlyMonth(selectedRoutine.yearlyDate?.month ?? 1);
      setEditYearlyDay(selectedRoutine.yearlyDate?.day ?? 1);
      setEditIsSkippable(selectedRoutine.isSkippable);
      setEditShowStreak(selectedRoutine.showStreak);
      setEditTimeType(selectedRoutine.timeType);
      setEditSpecificTime(selectedRoutine.specificTime ?? "");
      setIsEditing(false);
    }
  }, [selectedRoutine]);

  const handleSave = async () => {
    if (!selectedRoutine) return;

    setIsSaving(true);
    try {
      // Build update data based on frequency
      const updateData: any = {
        title: editTitle,
        frequency: editFrequency,
        isSkippable: editIsSkippable,
        showStreak: editShowStreak,
        timeType: editTimeType,
        specificTime:
          editTimeType === "Specific" ? editSpecificTime : undefined,
      };

      // Add frequency-specific fields
      switch (editFrequency) {
        case "Weekly":
          updateData.weekday = editWeekday;
          break;
        case "Monthly":
          updateData.dayOfMonth = editDayOfMonth;
          break;
        case "Quarterly":
          updateData.quarterlyDay = editQuarterlyDay;
          break;
        case "Yearly":
          updateData.yearlyDate = {
            month: editYearlyMonth,
            day: editYearlyDay,
          };
          break;
      }

      await updateRoutine(selectedRoutine.id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save routine:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoutine) return;

    try {
      await deleteRoutine(selectedRoutine.id);
      setShowDeleteConfirm(false);
      selectRoutine(null); // Deselect after delete
    } catch (error) {
      console.error("Failed to delete routine:", error);
    }
  };

  if (!selectedRoutine) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Repeat className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No routine selected
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a routine to view details
        </p>
      </div>
    );
  }

  const frequencyColor = FREQUENCY_COLORS[selectedRoutine.frequency];

  // Display weekday name
  const getWeekdayName = (day: number) =>
    WEEKDAYS.find((w) => w.value === day)?.label || "";
  const getMonthName = (month: number) =>
    MONTHS.find((m) => m.value === month)?.label || "";

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold">Routine Details</h2>
        <button
          onClick={() => selectRoutine(null)}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <h3 className="text-xl font-semibold">{selectedRoutine.title}</h3>
          )}
        </div>

        {/* Frequency */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Repeat className="w-3 h-3" />
            Frequency
          </label>
          {isEditing ? (
            <select
              value={editFrequency}
              onChange={(e) =>
                setEditFrequency(e.target.value as RoutineFrequency)
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          ) : (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-lg ${frequencyColor.bg} ${frequencyColor.text} text-sm font-medium`}
            >
              {selectedRoutine.frequency}
            </div>
          )}
        </div>

        {/* Conditional Frequency Fields */}
        {isEditing && editFrequency === "Weekly" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Wochentag
            </label>
            <select
              value={editWeekday}
              onChange={(e) => setEditWeekday(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              {WEEKDAYS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isEditing &&
          selectedRoutine.frequency === "Weekly" &&
          selectedRoutine.weekday !== undefined && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Wochentag
              </label>
              <div className="text-sm">
                {getWeekdayName(selectedRoutine.weekday)}
              </div>
            </div>
          )}

        {isEditing && editFrequency === "Monthly" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Tag im Monat
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={editDayOfMonth}
              onChange={(e) => setEditDayOfMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {!isEditing &&
          selectedRoutine.frequency === "Monthly" &&
          selectedRoutine.dayOfMonth !== undefined && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Tag im Monat
              </label>
              <div className="text-sm">{selectedRoutine.dayOfMonth}.</div>
            </div>
          )}

        {isEditing && editFrequency === "Quarterly" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Tag im Quartal
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={editQuarterlyDay}
              onChange={(e) => setEditQuarterlyDay(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tag im Startmonat jedes Quartals (Jan, Apr, Jul, Okt)
            </p>
          </div>
        )}

        {!isEditing &&
          selectedRoutine.frequency === "Quarterly" &&
          selectedRoutine.quarterlyDay !== undefined && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Tag im Quartal
              </label>
              <div className="text-sm">
                {selectedRoutine.quarterlyDay}. (Jan, Apr, Jul, Okt)
              </div>
            </div>
          )}

        {isEditing && editFrequency === "Yearly" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Jährliches Datum
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={editYearlyMonth}
                onChange={(e) => setEditYearlyMonth(parseInt(e.target.value))}
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max="31"
                value={editYearlyDay}
                onChange={(e) => setEditYearlyDay(parseInt(e.target.value))}
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tag"
              />
            </div>
          </div>
        )}

        {!isEditing &&
          selectedRoutine.frequency === "Yearly" &&
          selectedRoutine.yearlyDate && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Jährliches Datum
              </label>
              <div className="text-sm">
                {selectedRoutine.yearlyDate.day}.{" "}
                {getMonthName(selectedRoutine.yearlyDate.month)}
              </div>
            </div>
          )}

        {/* Time Type */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Zeit
          </label>
          {isEditing ? (
            <select
              value={editTimeType}
              onChange={(e) =>
                setEditTimeType(e.target.value as RoutineTimeType)
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              {TIME_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TIME_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm">
              {TIME_TYPE_LABELS[selectedRoutine.timeType]}
            </div>
          )}
        </div>

        {/* Specific Time */}
        {isEditing && editTimeType === "Specific" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Uhrzeit
            </label>
            <input
              type="time"
              value={editSpecificTime}
              onChange={(e) => setEditSpecificTime(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
            />
          </div>
        )}

        {!isEditing &&
          selectedRoutine.timeType === "Specific" &&
          selectedRoutine.specificTime && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Uhrzeit
              </label>
              <div className="text-sm">{selectedRoutine.specificTime} Uhr</div>
            </div>
          )}

        {/* Options */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground block">
            Optionen
          </label>

          {/* Skippable */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                type="checkbox"
                checked={editIsSkippable}
                onChange={(e) => setEditIsSkippable(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
            ) : (
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedRoutine.isSkippable
                    ? "bg-primary border-primary"
                    : "border-muted-foreground"
                }`}
              >
                {selectedRoutine.isSkippable && (
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
            )}
            <div className="flex items-center gap-2 text-sm">
              <SkipForward className="w-4 h-4 text-muted-foreground" />
              <span>Skippable (Streak bleibt erhalten)</span>
            </div>
          </div>

          {/* Show Streak */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                type="checkbox"
                checked={editShowStreak}
                onChange={(e) => setEditShowStreak(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
            ) : (
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedRoutine.showStreak
                    ? "bg-primary border-primary"
                    : "border-muted-foreground"
                }`}
              >
                {selectedRoutine.showStreak && (
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
            )}
            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-muted-foreground" />
              <span>Streak anzeigen</span>
            </div>
          </div>
        </div>

        {/* Streak Info (Read-only) */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Current Streak
              </label>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-2xl font-bold text-orange-500">
                  {selectedRoutine.currentStreak}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Longest Streak
              </label>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold text-purple-500">
                  {selectedRoutine.longestStreak}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Created/Updated Info */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>
              <div className="mt-0.5">
                {format(new Date(selectedRoutine.createdAt), "PPp", {
                  locale: de,
                })}
              </div>
            </div>
            <div>
              <span className="font-medium">Updated:</span>
              <div className="mt-0.5">
                {format(new Date(selectedRoutine.updatedAt), "PPp", {
                  locale: de,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="pt-4 border-t border-border space-y-2">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !editTitle.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Routine
          </button>
        )}

        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Routine
          </button>
        ) : (
          <div className="space-y-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-500 font-medium">
              Are you sure you want to delete this routine?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
