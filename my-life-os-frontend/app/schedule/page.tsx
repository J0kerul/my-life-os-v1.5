"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { useEventStore } from "@/lib/store/event-store";
import { CalendarView } from "@/components/schedule/calendar-view";
import { EventDetailView } from "@/components/schedule/event-detail-view";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { CalendarView as CalendarViewType } from "@/types";

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    currentView,
    currentDate,
    setCurrentView,
    setCurrentDate,
    goToToday,
    fetchEvents,
  } = useEventStore();

  // Helper: Get start of week (Monday)
  const getWeekStart = (date: Date | string) => {
    const d = date instanceof Date ? new Date(date) : new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const weekStart = new Date(d);
    weekStart.setDate(diff);
    return weekStart;
  };

  // Helper: Get date range for current view
  const getDateRangeForView = () => {
    // Convert currentDate to Date object if it's a string
    const date =
      currentDate instanceof Date ? currentDate : new Date(currentDate);
    const start = new Date(date);
    const end = new Date(date);

    switch (currentView) {
      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        const weekStart = getWeekStart(date);
        start.setTime(weekStart.getTime());
        start.setHours(0, 0, 0, 0);
        end.setTime(weekStart.getTime());
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case "day":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "agenda":
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 30);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  };

  // Fetch events when view or date changes
  useEffect(() => {
    const { start, end } = getDateRangeForView();
    fetchEvents(start.toISOString(), end.toISOString());
  }, [currentView, currentDate, fetchEvents]);

  // Helper: Get current period text
  const getCurrentPeriodText = () => {
    // Convert currentDate to Date object if it's a string
    const date =
      currentDate instanceof Date ? currentDate : new Date(currentDate);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    switch (currentView) {
      case "month":
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      case "week":
        const weekStart = getWeekStart(date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${format(weekStart, "MMM d")} - ${format(
          weekEnd,
          "MMM d, yyyy"
        )}`;
      case "day":
        return format(date, "EEEE, MMMM d, yyyy");
      case "agenda":
        return "Next 30 Days";
      default:
        return "";
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    const date =
      currentDate instanceof Date
        ? new Date(currentDate)
        : new Date(currentDate);

    switch (currentView) {
      case "month":
        date.setMonth(date.getMonth() - 1);
        break;
      case "week":
        date.setDate(date.getDate() - 7);
        break;
      case "day":
        date.setDate(date.getDate() - 1);
        break;
      case "agenda":
        date.setDate(date.getDate() - 30);
        break;
    }
    setCurrentDate(date);
  };

  const handleNext = () => {
    const date =
      currentDate instanceof Date
        ? new Date(currentDate)
        : new Date(currentDate);

    switch (currentView) {
      case "month":
        date.setMonth(date.getMonth() + 1);
        break;
      case "week":
        date.setDate(date.getDate() + 7);
        break;
      case "day":
        date.setDate(date.getDate() + 1);
        break;
      case "agenda":
        date.setDate(date.getDate() + 30);
        break;
    }
    setCurrentDate(date);
  };

  return (
    <AuthGuard>
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen p-8 pl-24">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            {/* Left: View Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView("month")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-accent"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "week"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-accent"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView("day")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "day"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-accent"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setCurrentView("agenda")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "agenda"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-accent"
                }`}
              >
                Agenda
              </button>
            </div>

            {/* Center: Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={goToToday}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Today
              </button>

              <button
                onClick={handleNext}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold min-w-[200px] text-center">
                {getCurrentPeriodText()}
              </h2>
            </div>

            {/* Right: Spacer for balance */}
            <div className="w-[400px]" />
          </div>

          {/* Main Content: Calendar + Detail View */}
          <div className="flex gap-6 h-[calc(100vh-180px)]">
            {/* Calendar Area */}
            <div className="flex-1 bg-card border-2 border-border rounded-xl overflow-hidden">
              <CalendarView />
            </div>

            {/* Event Detail Panel */}
            <div className="w-[450px] bg-card border-2 border-border rounded-xl p-6">
              <EventDetailView />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
