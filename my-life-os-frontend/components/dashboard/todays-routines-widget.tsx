"use client";

import { useState, useEffect } from "react";
import { useRoutineStore } from "@/lib/store/routine-store";
import {
  ChevronDown,
  ChevronUp,
  Repeat,
  Plus,
  SkipForward,
  Check,
} from "lucide-react";
import { QuickAddDialog } from "@/components/routines/quick-add-dialog";

interface TodaysRoutinesWidgetProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function TodaysRoutinesWidget({
  isExpanded,
  onToggleExpand,
}: TodaysRoutinesWidgetProps) {
  const { routines, fetchTodaysRoutines, completeRoutine, skipRoutine } =
    useRoutineStore();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [skippedToday, setSkippedToday] = useState<Set<string>>(new Set());

  // Fetch today's routines on mount
  useEffect(() => {
    fetchTodaysRoutines();
  }, [fetchTodaysRoutines]);

  // Calculate pending routines (not completed and not skipped)
  const pendingRoutines = routines.filter(
    (routine) =>
      !completedToday.has(routine.id) && !skippedToday.has(routine.id)
  );

  const handleComplete = async (routineId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await completeRoutine(routineId);
      setCompletedToday((prev) => new Set(prev).add(routineId));
    } catch (error) {
      console.error("Failed to complete routine:", error);
    }
  };

  const handleSkip = async (routineId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await skipRoutine(routineId);
      setSkippedToday((prev) => new Set(prev).add(routineId));
    } catch (error) {
      console.error("Failed to skip routine:", error);
    }
  };

  return (
    <>
      {/* Widget Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Icon - Colored (Green) */}
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Repeat className="w-5 h-5 text-green-500" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-200">
              Today's Routines
            </h2>

            {/* Badge - Pending count */}
            {!isExpanded && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                {pendingRoutines.length}
              </span>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Add Button */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Add Routine"
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
          <div className="p-4 space-y-4 h-[380px] flex flex-col">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{pendingRoutines.length} routines pending</span>
              {routines.length > 0 && (
                <span>
                  {completedToday.size + skippedToday.size}/{routines.length}{" "}
                  done
                </span>
              )}
            </div>

            {/* Routine List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {routines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No routines for today! 🌟</p>
                  <p className="text-xs mt-1">Click + to add a new routine</p>
                </div>
              ) : (
                routines.map((routine) => {
                  const isCompleted = completedToday.has(routine.id);
                  const isSkipped = skippedToday.has(routine.id);
                  const isDone = isCompleted || isSkipped;

                  return (
                    <div
                      key={routine.id}
                      className={`flex items-start gap-3 p-3 bg-background border border-border rounded-lg transition-colors ${
                        isDone ? "opacity-50" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => handleComplete(routine.id, e)}
                        disabled={isDone}
                        className="mt-0.5 flex-shrink-0"
                      >
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                            isCompleted
                              ? "bg-green-500 border-green-500"
                              : "border-border hover:border-green-500"
                          }`}
                        >
                          {isCompleted && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </button>

                      {/* Routine Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-sm text-gray-200 ${
                            isDone ? "line-through" : ""
                          }`}
                        >
                          {routine.title}
                        </h3>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{routine.frequency}</span>
                          {routine.showStreak && (
                            <>
                              <span>•</span>
                              <span>🔥 {routine.currentStreak}</span>
                            </>
                          )}
                          {isSkipped && (
                            <>
                              <span>•</span>
                              <span className="text-amber-500">Skipped</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Skip Button (only for skippable routines) */}
                      {routine.isSkippable && !isDone && (
                        <button
                          onClick={(e) => handleSkip(routine.id, e)}
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors group"
                          title="Skip routine"
                        >
                          <SkipForward className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Dialog */}
      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          fetchTodaysRoutines(); // Refresh after adding
        }}
      />
    </>
  );
}
