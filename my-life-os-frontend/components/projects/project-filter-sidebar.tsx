"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  Clipboard,
  Zap,
  Bug,
  TestTube2,
  Pause,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useProjectStore } from "@/lib/store/project-store";
import { useTechStackStore } from "@/lib/store/techstack-store";
import { useCategoryStore } from "@/lib/store/category-store";
import type { ProjectStatus } from "@/types";

const STATUS_OPTIONS: {
  value: ProjectStatus;
  label: string;
  icon: any;
  color: string;
}[] = [
  { value: "Idea", label: "Idea", icon: Lightbulb, color: "text-gray-400" },
  {
    value: "Planning",
    label: "Planning",
    icon: Clipboard,
    color: "text-blue-400",
  },
  { value: "Active", label: "Active", icon: Zap, color: "text-green-400" },
  {
    value: "Debugging",
    label: "Debugging",
    icon: Bug,
    color: "text-yellow-400",
  },
  {
    value: "Testing",
    label: "Testing",
    icon: TestTube2,
    color: "text-orange-400",
  },
  { value: "OnHold", label: "On Hold", icon: Pause, color: "text-purple-400" },
  {
    value: "Finished",
    label: "Finished",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  {
    value: "Abandoned",
    label: "Abandoned",
    icon: XCircle,
    color: "text-slate-400",
  },
];

export function ProjectFilterSidebar() {
  const {
    statusFilter,
    techStackFilter,
    setStatusFilter,
    setTechStackFilter,
    clearFilters,
  } = useProjectStore();
  const { items: techStackItems, fetchItems } = useTechStackStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [fetchCategories, fetchItems]);

  // Group tech stack items by category
  const itemsByCategory = techStackItems.reduce((acc, item) => {
    const categoryName = item.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, typeof techStackItems>);

  const handleStatusClick = (status: ProjectStatus) => {
    if (statusFilter === status) {
      setStatusFilter(null);
    } else {
      setStatusFilter(status);
    }
  };

  const handleTechStackToggle = (techStackId: string) => {
    if (techStackFilter.includes(techStackId)) {
      setTechStackFilter(techStackFilter.filter((id) => id !== techStackId));
    } else {
      setTechStackFilter([...techStackFilter, techStackId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Filter projects by status and tech stack
        </p>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((status) => {
            const Icon = status.icon;
            const isActive = statusFilter === status.value;
            return (
              <button
                key={status.value}
                onClick={() => handleStatusClick(status.value)}
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

      {/* Tech Stack Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Tech Stack
        </h3>
        <div className="space-y-4">
          {techStackItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tech stack items available. Create some in Settings!
            </p>
          ) : (
            Object.entries(itemsByCategory).map(([categoryName, items]) => (
              <div key={categoryName}>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {categoryName}
                </h4>
                <div className="space-y-1">
                  {items.map((item) => {
                    const isChecked = techStackFilter.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTechStackToggle(item.id)}
                          className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-foreground">
                          {item.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
