"use client";

import { CalendarView } from "@/types";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  currentDate: Date;
  currentView: CalendarView;
  onDateChange: (date: Date) => void;
}

export function CalendarNavigation({
  currentDate,
  currentView,
  onDateChange,
}: CalendarNavigationProps) {
  const handlePrevious = () => {
    switch (currentView) {
      case "month":
        onDateChange(subMonths(currentDate, 1));
        break;
      case "week":
        onDateChange(subWeeks(currentDate, 1));
        break;
      case "day":
        onDateChange(subDays(currentDate, 1));
        break;
      case "agenda":
        onDateChange(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case "month":
        onDateChange(addMonths(currentDate, 1));
        break;
      case "week":
        onDateChange(addWeeks(currentDate, 1));
        break;
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
      case "agenda":
        onDateChange(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(startOfToday());
  };

  const getDateLabel = () => {
    switch (currentView) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        return `Week ${format(currentDate, "w, yyyy")}`;
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "agenda":
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToday}
        className="px-4 py-2 text-sm font-medium border border-muted-foreground/20 rounded-lg hover:bg-muted/20 transition-colors"
      >
        Today
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
          title="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
          title="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="text-xl font-semibold min-w-[280px]">
        {getDateLabel()}
      </div>
    </div>
  );
}
