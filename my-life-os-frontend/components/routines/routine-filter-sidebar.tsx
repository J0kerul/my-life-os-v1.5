"use client";

import { useRoutineStore } from "@/lib/store/routine-store";
import type { RoutineFrequency } from "@/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
  const [isFrequencyDropdownOpen, setIsFrequencyDropdownOpen] = useState(false);

  const handleFrequencyFilterChange = (filter: RoutineFrequency | null) => {
    setFrequencyFilter(filter);
    setIsFrequencyDropdownOpen(false);
  };

  const currentFrequencyLabel =
    FREQUENCY_FILTERS.find((f) => f.value === frequencyFilter)?.label ||
    "All Routines";

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

      {/* Frequency Filter Dropdown */}
      <div>
        <label className="text-sm font-medium mb-2 block">Frequency</label>
        <div className="relative">
          <button
            onClick={() => setIsFrequencyDropdownOpen(!isFrequencyDropdownOpen)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-left flex items-center justify-between hover:bg-accent transition-colors"
          >
            <span>{currentFrequencyLabel}</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isFrequencyDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isFrequencyDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFrequencyDropdownOpen(false)}
              />

              {/* Menu */}
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                {FREQUENCY_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleFrequencyFilterChange(filter.value)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${
                      frequencyFilter === filter.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {frequencyFilter && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active Filter:</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              <span>Frequency: {currentFrequencyLabel}</span>
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
