"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { ViewSwitcher } from "@/components/schedule/view-switcher";
import { DomainFilterChips } from "@/components/schedule/domain-filter-chips";
import { MonthCalendar } from "@/components/schedule/month-calendar";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { ScheduleEvent } from "@/types";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const {
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    events,
    domainFilters,
    toggleDomainFilter,
    clearDomainFilters,
    fetchEvents,
  } = useScheduleStore();

  useEffect(() => {
    // Fetch events for current month
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    fetchEvents(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  }, [currentDate, fetchEvents]);

  useEffect(() => {
    // TODO: Fetch events for initial date range
    // Will be implemented when we add the calendar logic
  }, []);

  return (
    <AuthGuard>
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen py-8 pl-36 pr-48">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Calendar View - Left Side */}
          <main className="flex-1 min-w-0 bg-background border-2 border-muted-foreground/20 rounded-l-lg p-6 overflow-y-auto flex flex-col">
            {/* Header with View Switcher */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button className="px-3 py-2 text-sm hover:bg-accent rounded transition-colors">
                  ← Prev
                </button>
                <h1 className="text-3xl font-bold">Januar 2026</h1>
                <button className="px-3 py-2 text-sm hover:bg-accent rounded transition-colors">
                  Next →
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* View Switcher */}
                <ViewSwitcher
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />

                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  + New Event
                </button>
              </div>
            </div>

            {/* Domain Filter Chips */}
            <div className="mb-6">
              <DomainFilterChips
                selectedDomains={domainFilters}
                onToggleDomain={toggleDomainFilter}
                onClearAll={clearDomainFilters}
              />
            </div>

            {/* Calendar Views */}
            <div className="flex-1 min-h-0">
              {currentView === "month" && (
                <MonthCalendar
                  currentDate={currentDate}
                  events={events}
                  selectedDomains={domainFilters}
                  onDateClick={(date) => setCurrentDate(date)}
                  onEventClick={(event) => setSelectedEvent(event)}
                />
              )}

              {currentView === "week" && (
                <div className="bg-card border-2 border-muted-foreground/20 rounded-lg p-6">
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-lg font-medium mb-2">Week View</p>
                    <p className="text-sm">Coming soon...</p>
                  </div>
                </div>
              )}

              {currentView === "day" && (
                <div className="bg-card border-2 border-muted-foreground/20 rounded-lg p-6">
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-lg font-medium mb-2">Day View</p>
                    <p className="text-sm">Coming soon...</p>
                  </div>
                </div>
              )}

              {currentView === "agenda" && (
                <div className="bg-card border-2 border-muted-foreground/20 rounded-lg p-6">
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg font-medium mb-2">Agenda View</p>
                    <p className="text-sm">Coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Event Detail Card - Right Side */}
          <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
            <div className="text-center text-muted-foreground py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Event Details</h3>
              <p className="text-sm mb-6">
                Wähle ein Event aus oder erstelle ein neues
              </p>

              {/* Placeholder Form */}
              <div className="text-left space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titel
                  </label>
                  <input
                    type="text"
                    placeholder="Event Titel..."
                    className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Domain
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm"
                    disabled
                  >
                    <option>Personal</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ende
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled />
                  <label className="text-sm">Ganztägig</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ort</label>
                  <input
                    type="text"
                    placeholder="Standort..."
                    className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Wiederholung
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm"
                    disabled
                  >
                    <option>Keine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    placeholder="Beschreibung..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm resize-none"
                    disabled
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    className="flex-1 px-4 py-2 bg-primary/50 text-primary-foreground rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Speichern
                  </button>
                  <button
                    className="px-4 py-2 bg-destructive/50 text-destructive-foreground rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Löschen
                  </button>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-2">
                  Detail Component wird hier implementiert
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
