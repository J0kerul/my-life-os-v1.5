"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { ViewSwitcher } from "@/components/schedule/view-switcher";
import { DomainFilterChips } from "@/components/schedule/domain-filter-chips";
import { MonthCalendar } from "@/components/schedule/month-calendar";
import { WeekView } from "@/components/schedule/week-view";
import { DayView } from "@/components/schedule/day-view";
import { AgendaView } from "@/components/schedule/agenda-view";
import { EventDetailCard } from "@/components/schedule/event-detail-card";
import { CalendarNavigation } from "@/components/schedule/calendar-navigation";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { ScheduleEvent } from "@/types";
import { startOfMonth, endOfMonth } from "date-fns";

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const [showEventDetail, setShowEventDetail] = useState(false);
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
    createEvent,
    updateEvent,
    deleteEvent,
    conflicts,
  } = useScheduleStore();

  useEffect(() => {
    // Fetch events for current month
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    fetchEvents(start.toISOString(), end.toISOString());
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
              <CalendarNavigation
                currentDate={currentDate}
                currentView={currentView}
                onDateChange={setCurrentDate}
              />

              <div className="flex items-center gap-2">
                {/* View Switcher */}
                <ViewSwitcher
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />

                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setShowEventDetail(true);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
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
                  onEventClick={(event) => {
                    setSelectedEvent(event);
                    setShowEventDetail(true);
                  }}
                />
              )}

              {currentView === "week" && (
                <WeekView
                  currentDate={currentDate}
                  events={events}
                  selectedDomains={domainFilters}
                  onDateClick={(date) => setCurrentDate(date)}
                  onEventClick={(event) => {
                    setSelectedEvent(event);
                    setShowEventDetail(true);
                  }}
                />
              )}

              {currentView === "day" && (
                <DayView
                  currentDate={currentDate}
                  events={events}
                  selectedDomains={domainFilters}
                  onEventClick={(event) => {
                    setSelectedEvent(event);
                    setShowEventDetail(true);
                  }}
                />
              )}

              {currentView === "agenda" && (
                <AgendaView
                  currentDate={currentDate}
                  events={events}
                  selectedDomains={domainFilters}
                  onEventClick={(event) => {
                    setSelectedEvent(event);
                    setShowEventDetail(true);
                  }}
                />
              )}
            </div>
          </main>

          {/* Event Detail Card or Placeholder - Right Side */}
          {showEventDetail ? (
            <EventDetailCard
              event={selectedEvent}
              selectedDate={selectedEvent ? null : currentDate}
              onClose={() => {
                setSelectedEvent(null);
                setShowEventDetail(false);
              }}
              onCreate={async (eventData) => {
                await createEvent(eventData);
                // Refetch events after create
                const start = startOfMonth(currentDate);
                const end = endOfMonth(currentDate);
                await fetchEvents(start.toISOString(), end.toISOString());
              }}
              onUpdate={async (eventId, eventData, deleteType) => {
                await updateEvent(eventId, eventData);
                setSelectedEvent(null);
                setShowEventDetail(false);
                // Refetch events after update
                const start = startOfMonth(currentDate);
                const end = endOfMonth(currentDate);
                await fetchEvents(start.toISOString(), end.toISOString());
              }}
              onDelete={async (eventId, deleteType, instanceDate) => {
                await deleteEvent(eventId, deleteType, instanceDate);
                setSelectedEvent(null);
                setShowEventDetail(false);
                // Store handles refetching after delete
              }}
              conflicts={conflicts}
            />
          ) : (
            <aside className="w-96 border-2 border-l-0 border-muted-foreground/20 bg-background rounded-r-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Select an event or create a new one</p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
