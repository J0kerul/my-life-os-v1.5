"use client";

import { useTaskStore } from "@/lib/store/task-store";
import type { TaskDomain, TimeFilter } from "@/types";
import {
  Clock,
  Calendar,
  CalendarClock,
  CalendarDays,
  Hourglass,
  Infinity,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code2,
  Lightbulb,
  Target,
  Wallet,
  Home,
  HeartPulse,
  Circle,
  CheckCircle2,
} from "lucide-react";

const TIME_FILTERS: {
  value: TimeFilter | null;
  label: string;
  icon: any;
  color: string;
}[] = [
  { value: null, label: "All Tasks", icon: Infinity, color: "text-gray-400" },
  {
    value: "overdue",
    label: "Overdue",
    icon: AlertCircle,
    color: "text-red-400",
  },
  { value: "today", label: "Today", icon: Clock, color: "text-blue-400" },
  {
    value: "tomorrow",
    label: "Tomorrow",
    icon: Calendar,
    color: "text-green-400",
  },
  {
    value: "next_week",
    label: "Next Week",
    icon: CalendarDays,
    color: "text-purple-400",
  },
  {
    value: "next_month",
    label: "Next Month",
    icon: CalendarClock,
    color: "text-orange-400",
  },
  {
    value: "long_term",
    label: "Long Term",
    icon: Hourglass,
    color: "text-slate-400",
  },
];

const DOMAINS: {
  value: TaskDomain;
  label: string;
  icon: any;
  color: string;
}[] = [
  { value: "Work", label: "Work", icon: Briefcase, color: "text-blue-400" },
  {
    value: "University",
    label: "University",
    icon: GraduationCap,
    color: "text-purple-400",
  },
  {
    value: "Coding Project",
    label: "Coding Project",
    icon: Code2,
    color: "text-green-400",
  },
  {
    value: "Personal Project",
    label: "Personal Project",
    icon: Lightbulb,
    color: "text-yellow-400",
  },
  { value: "Goals", label: "Goals", icon: Target, color: "text-red-400" },
  {
    value: "Finances",
    label: "Finances",
    icon: Wallet,
    color: "text-emerald-400",
  },
  {
    value: "Household",
    label: "Household",
    icon: Home,
    color: "text-orange-400",
  },
  {
    value: "Health",
    label: "Health",
    icon: HeartPulse,
    color: "text-pink-400",
  },
];

const STATUS_OPTIONS: {
  value: "Todo" | "Done";
  label: string;
  icon: any;
  color: string;
}[] = [
  { value: "Todo", label: "To do", icon: Circle, color: "text-blue-400" },
  { value: "Done", label: "Done", icon: CheckCircle2, color: "text-green-400" },
];

export function TaskFilterSidebar() {
  const {
    timeFilter,
    domainFilter,
    statusFilter,
    setTimeFilter,
    setDomainFilter,
    setStatusFilter,
    clearFilters,
  } = useTaskStore();

  const handleTimeFilterChange = (filter: TimeFilter | null) => {
    setTimeFilter(filter);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Filter tasks by time, domain, and status
        </p>
      </div>

      {/* Time Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Time</h3>
        <div className="space-y-2">
          {TIME_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = timeFilter === filter.value;
            return (
              <button
                key={filter.value ?? "all"}
                onClick={() => handleTimeFilterChange(filter.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-primary" : filter.color
                  }`}
                />
                <span className="text-sm">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Domain</h3>
        <div className="space-y-2">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = domainFilter === domain.value;
            return (
              <button
                key={domain.value}
                onClick={() => handleDomainFilterToggle(domain.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-primary" : domain.color
                  }`}
                />
                <span className="text-sm">{domain.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Completion
        </h3>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((status) => {
            const Icon = status.icon;
            const isActive = statusFilter === status.value;
            return (
              <button
                key={status.value}
                onClick={() => handleStatusFilterToggle(status.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-primary" : status.color
                  }`}
                />
                <span className="text-sm">{status.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
