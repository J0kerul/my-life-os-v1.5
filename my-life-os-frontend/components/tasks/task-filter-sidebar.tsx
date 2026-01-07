"use client";

import { useTaskStore } from "@/lib/store/task-store";
import type { TaskDomain, TimeFilter } from "@/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const TIME_FILTERS: { value: TimeFilter | null; label: string }[] = [
  { value: null, label: "All Tasks" },
  { value: "long_term", label: "Long Term" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "next_week", label: "Next Week" },
  { value: "next_month", label: "Next Month" },
];

const DOMAINS: TaskDomain[] = [
  "Work",
  "University",
  "Coding Project",
  "Personal Project",
  "Goals",
  "Finances",
  "Household",
  "Health",
];

export function TaskFilterSidebar() {
  const { 
    timeFilter, 
    domainFilter, 
    statusFilter,
    setTimeFilter, 
    setDomainFilter, 
    setStatusFilter,
    clearFilters 
  } = useTaskStore();
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const handleTimeFilterChange = (filter: TimeFilter | null) => {
    setTimeFilter(filter);
    setIsTimeDropdownOpen(false);
  };

  const handleDomainFilterToggle = (domain: TaskDomain) => {
    if (domainFilter === domain) {
      // Deselect - clear domain filter
      setDomainFilter(null);
    } else {
      // Select new domain
      setDomainFilter(domain);
    }
  };

  const handleStatusFilterToggle = (status: "Todo" | "Done") => {
    if (statusFilter === status) {
      // Deselect - show all tasks
      setStatusFilter(null);
    } else {
      // Select status
      setStatusFilter(status);
    }
  };

  const currentTimeLabel = TIME_FILTERS.find((f) => f.value === timeFilter)?.label || "All Tasks";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        {(timeFilter !== null || domainFilter || statusFilter) && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Time Filter Dropdown */}
      <div>
        <label className="text-sm font-medium mb-2 block">Time</label>
        <div className="relative">
          <button
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-left flex items-center justify-between hover:bg-accent transition-colors"
          >
            <span>{currentTimeLabel}</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isTimeDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isTimeDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsTimeDropdownOpen(false)}
              />

              {/* Menu */}
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                {TIME_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleTimeFilterChange(filter.value)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${
                      timeFilter === filter.value
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

      {/* Domain Filter Buttons */}
      <div>
        <label className="text-sm font-medium mb-2 block">Domain</label>
        <div className="space-y-1">
          {DOMAINS.map((domain) => {
            const isActive = domainFilter === domain;
            return (
              <button
                key={domain}
                onClick={() => handleDomainFilterToggle(domain)}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-background border border-border hover:bg-accent"
                }`}
              >
                {domain}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Filter Buttons */}
      <div>
        <label className="text-sm font-medium mb-2 block">Completion</label>
        <div className="space-y-1">
          <button
            onClick={() => handleStatusFilterToggle("Todo")}
            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
              statusFilter === "Todo"
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-background border border-border hover:bg-accent"
            }`}
          >
            To do
          </button>
          <button
            onClick={() => handleStatusFilterToggle("Done")}
            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
              statusFilter === "Done"
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-background border border-border hover:bg-accent"
            }`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(timeFilter !== null || domainFilter || statusFilter) && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active Filters:</p>
          <div className="space-y-1">
            {timeFilter !== null && (
              <div className="flex items-center justify-between text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                <span>Time: {currentTimeLabel}</span>
                <button
                  onClick={() => setTimeFilter(null)}
                  className="hover:text-primary-foreground transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            {domainFilter && (
              <div className="flex items-center justify-between text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                <span>Domain: {domainFilter}</span>
                <button
                  onClick={() => setDomainFilter(null)}
                  className="hover:text-primary-foreground transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            {statusFilter && (
              <div className="flex items-center justify-between text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                <span>Status: {statusFilter}</span>
                <button
                  onClick={() => setStatusFilter(null)}
                  className="hover:text-primary-foreground transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}