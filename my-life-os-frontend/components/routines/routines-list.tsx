"use client";

import { useRoutineStore } from "@/lib/store/routine-store";
import { RoutineItem } from "./routine-item";

export function RoutineList() {
  const { routines, isLoading } = useRoutineStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading routines...</div>
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">No routines yet</p>
        <p className="text-sm text-muted-foreground">
          Click &quot;+ New Routine&quot; to create your first routine
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b border-border">
        <span>
          {routines.length} {routines.length === 1 ? "routine" : "routines"}
        </span>
      </div>

      {/* Routine Items */}
      <div className="space-y-2">
        {routines.map((routine) => (
          <RoutineItem key={routine.id} routine={routine} />
        ))}
      </div>
    </div>
  );
}
