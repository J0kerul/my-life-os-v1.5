"use client";

import { Flame, Clock, SkipForward } from "lucide-react";
import { useRoutineStore } from "@/lib/store/routine-store";
import type { Routine } from "@/types";

interface RoutineItemProps {
  routine: Routine;
}

export function RoutineItem({ routine }: RoutineItemProps) {
  const { selectRoutine, selectedRoutine } = useRoutineStore();

  const isSelected = selectedRoutine?.id === routine.id;

  // Frequency colors
  const getFrequencyStyles = () => {
    switch (routine.frequency) {
      case "Daily":
        return {
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        };
      case "Weekly":
        return {
          color: "text-green-500",
          bg: "bg-green-500/10",
        };
      case "Monthly":
        return {
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        };
      case "Quarterly":
        return {
          color: "text-orange-500",
          bg: "bg-orange-500/10",
        };
      case "Yearly":
        return {
          color: "text-pink-500",
          bg: "bg-pink-500/10",
        };
    }
  };

  const frequencyStyles = getFrequencyStyles();

  // Format time display
  const getTimeDisplay = () => {
    switch (routine.timeType) {
      case "AM":
        return "Morgens";
      case "PM":
        return "Abends";
      case "AllDay":
        return "Ganztags";
      case "Specific":
        return routine.specificTime || "Bestimmte Zeit";
    }
  };

  return (
    <div
      onClick={() => selectRoutine(routine)}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
        isSelected
          ? "bg-primary/10 border-primary"
          : "bg-card border-border hover:bg-accent"
      }`}
    >
      {/* Frequency Badge */}
      <div
        className={`px-2 py-1 rounded text-xs font-medium ${frequencyStyles.bg} ${frequencyStyles.color}`}
      >
        {routine.frequency}
      </div>

      {/* Routine Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{routine.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {/* Time Type */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeDisplay()}</span>
          </div>

          {/* Skippable Indicator */}
          {routine.isSkippable && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <SkipForward className="w-3 h-3" />
                <span>Skippable</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Streak Badge */}
      {routine.showStreak && routine.currentStreak > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-500 text-xs font-medium rounded">
          <Flame className="w-3 h-3" />
          <span>{routine.currentStreak}</span>
        </div>
      )}
    </div>
  );
}
