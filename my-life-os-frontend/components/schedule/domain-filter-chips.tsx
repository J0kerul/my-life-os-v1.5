"use client";

import { ScheduleDomain } from "@/types";
import { X } from "lucide-react";

interface DomainFilterChipsProps {
  selectedDomains: Set<ScheduleDomain>;
  onToggleDomain: (domain: ScheduleDomain) => void;
  onClearAll: () => void;
}

const domainConfig: Record<
  ScheduleDomain,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  Personal: {
    label: "Personal",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
  },
  Family: {
    label: "Family",
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/50",
  },
  Working: {
    label: "Working",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/50",
  },
  University: {
    label: "University",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
  },
  Health: {
    label: "Health",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/50",
  },
  Social: {
    label: "Social",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/50",
  },
  Coding: {
    label: "Coding",
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/50",
  },
  Holidays: {
    label: "Holidays",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/50",
  },
};

export function DomainFilterChips({
  selectedDomains,
  onToggleDomain,
  onClearAll,
}: DomainFilterChipsProps) {
  const domains = Object.keys(domainConfig) as ScheduleDomain[];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-sm text-muted-foreground font-medium">Filter:</div>

      {domains.map((domain) => {
        const config = domainConfig[domain];
        const isSelected = selectedDomains.has(domain);

        return (
          <button
            key={domain}
            onClick={() => onToggleDomain(domain)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              config.color
            } ${config.bgColor} ${config.borderColor} ${
              isSelected
                ? "ring-2 ring-offset-2 ring-offset-background opacity-100"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            {config.label}
          </button>
        );
      })}

      {selectedDomains.size > 0 && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-foreground border border-muted-foreground/30 rounded-full transition-colors"
        >
          <X className="w-3 h-3" />
          Clear All
        </button>
      )}
    </div>
  );
}
