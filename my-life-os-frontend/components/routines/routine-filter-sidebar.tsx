"use client";

import { useRoutineStore } from "@/lib/store/routine-store";
import type { RoutineFrequency } from "@/types";

const FREQUENCY_FILTERS: { value: RoutineFrequency | null; label: string }[] = [
  { value: null, label: "All Routines" },
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Yearly", label: "Yearly" },
];

export function RoutineFilterSidebar() {
  const { frequencyFilter, setFrequencyFilter, clearFilters } =
    useRoutineStore();

  const handleFrequencyFilterToggle = (frequency: RoutineFrequency | null) => {
    if (frequencyFilter === frequency) {
      // Deselect - clear filter
      setFrequencyFilter(null);
    } else {
      // Select new frequency
      setFrequencyFilter(frequency);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        {frequencyFilter && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Frequency Filter Buttons */}
      <div>
        <label className="text-sm font-medium mb-2 block">Frequency</label>
        <div className="space-y-1">
          <button
            onClick={() => handleFrequencyFilterToggle(null)}
            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
              frequencyFilter === null
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-background border border-border hover:bg-accent"
            }`}
          >
            All Routines
          </button>
          {FREQUENCY_FILTERS.filter((f) => f.value !== null).map((filter) => {
            const isActive = frequencyFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => handleFrequencyFilterToggle(filter.value)}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-background border border-border hover:bg-accent"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {frequencyFilter && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active Filter:</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              <span>
                Frequency:{" "}
                {
                  FREQUENCY_FILTERS.find((f) => f.value === frequencyFilter)
                    ?.label
                }
              </span>
              <button
                onClick={() => setFrequencyFilter(null)}
                className="hover:text-primary-foreground transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
