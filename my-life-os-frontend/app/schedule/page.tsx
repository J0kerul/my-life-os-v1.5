"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { CalendarView } from "@/components/schedule/calendar-view";
import { EventDetailView } from "@/components/schedule/event-detail-view";
import { QuickAddEventDialog } from "@/components/schedule/quick-add-event-dialog";
import { useEventStore } from "@/lib/store/event-store";
import type { CalendarView as ViewType } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const {
    currentView,
    currentDate,
    setCurrentView,
    setCurrentDate,
    goToToday,
    fetchEvents,
  } = useEventStore();

  // Fetch events when view or date changes
  useEffect(() => {
    const { start, end } = getDateRangeForView(currentView, currentDate);
    fetchEvents(start.toISOString(), end.toISOString());
  }, [currentView, currentDate, fetchEvents]);

  // Navigate to previous period
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "agenda":
        newDate.setDate(newDate.getDate() - 30);
        break;
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "agenda":
        newDate.setDate(newDate.getDate() + 30);
        break;
    }
    setCurrentDate(newDate);
  };

  // Format current period text
  const getCurrentPeriodText = () => {
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
        return `${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`;
      case "week":
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${
          monthNames[weekEnd.getMonth()]
        } ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      case "day":
        return `${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
      case "agenda":
        const agendaEnd = new Date(currentDate);
        agendaEnd.setDate(agendaEnd.getDate() + 30);
        return `${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getDate()} - ${
          monthNames[agendaEnd.getMonth()]
        } ${agendaEnd.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  return (
    <AuthGuard>
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <QuickAddEventDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <div className="min-h-screen py-8 pl-36 pr-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Main Calendar View */}
          <main className="flex-1 min-w-0 bg-card border-2 border-muted-foreground/20 rounded-l-lg p-6 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {/* Left: View Buttons + Navigation */}
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold mr-4">Schedule</h1>

                {/* View Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentView("month")}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      currentView === "month"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setCurrentView("week")}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      currentView === "week"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setCurrentView("day")}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      currentView === "day"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setCurrentView("agenda")}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      currentView === "agenda"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Agenda
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handlePrevious}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1.5 rounded bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Current Period Text */}
                <span className="text-lg font-medium ml-4">
                  {getCurrentPeriodText()}
                </span>
              </div>

              {/* Right: New Event Button */}
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                + New Event
              </button>
            </div>

            {/* Calendar View Component */}
            <div className="flex-1 overflow-auto">
              <CalendarView />
            </div>
          </main>

          {/* Event Detail Panel */}
          <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
            <EventDetailView />
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}

// Helper: Get week start (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper: Get date range for current view
function getDateRangeForView(
  view: ViewType,
  date: Date
): { start: Date; end: Date } {
  const start = new Date(date);
  const end = new Date(date);

  switch (view) {
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
}
