"use client";

import { X } from "lucide-react";

interface RecurringActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: "single" | "future" | "all") => void;
  actionType: "edit" | "delete";
}

export default function RecurringActionDialog({
  isOpen,
  onClose,
  onSelectOption,
  actionType,
}: RecurringActionDialogProps) {
  if (!isOpen) return null;

  const isEdit = actionType === "edit";
  const title = isEdit ? "Edit Recurring Event" : "Delete Recurring Event";
  const description = isEdit
    ? "This is a recurring event. What would you like to edit?"
    : "This is a recurring event. What would you like to delete?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border-2 border-muted-foreground/20 rounded-lg w-full max-w-md p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6">{description}</p>

        {/* Options */}
        <div className="space-y-3">
          <button
            onClick={() => onSelectOption("single")}
            className="w-full text-left p-4 rounded-lg border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="font-medium">
              {isEdit ? "This event only" : "Only this event"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isEdit
                ? "Edit only this occurrence"
                : "Delete only this occurrence"}
            </div>
          </button>

          <button
            onClick={() => onSelectOption("future")}
            className="w-full text-left p-4 rounded-lg border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="font-medium">
              {isEdit ? "This and future events" : "This and future events"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isEdit
                ? "Edit this and all following occurrences"
                : "Delete this and all following occurrences"}
            </div>
          </button>

          <button
            onClick={() => onSelectOption("all")}
            className="w-full text-left p-4 rounded-lg border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="font-medium">
              {isEdit ? "All events" : "All events"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isEdit
                ? "Edit all occurrences in the series"
                : "Delete all occurrences in the series"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
