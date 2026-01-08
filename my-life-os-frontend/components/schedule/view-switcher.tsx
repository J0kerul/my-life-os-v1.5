"use client";

import { CalendarView } from "@/types";
import { Calendar, CalendarDays, CalendarClock, List } from "lucide-react";

interface ViewSwitcherProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: { value: CalendarView; label: string; icon: React.ReactNode }[] =
    [
      {
        value: "month",
        label: "Monat",
        icon: <Calendar className="w-4 h-4" />,
      },
      {
        value: "week",
        label: "Woche",
        icon: <CalendarDays className="w-4 h-4" />,
      },
      {
        value: "day",
        label: "Tag",
        icon: <CalendarClock className="w-4 h-4" />,
      },
      { value: "agenda", label: "Agenda", icon: <List className="w-4 h-4" /> },
    ];

  return (
    <div className="flex items-center gap-1 bg-card border border-muted-foreground/20 rounded-lg p-1">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onViewChange(view.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            currentView === view.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          {view.icon}
          <span className="font-medium">{view.label}</span>
        </button>
      ))}
    </div>
  );
}
