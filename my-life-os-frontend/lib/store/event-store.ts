import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getEvents as apiGetEvents,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
} from "@/lib/api/events";
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  DeleteEventRequest,
  CalendarView,
} from "@/types";

interface EventStore {
  // State
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  currentView: CalendarView;
  currentDate: Date;

  // Actions
  fetchEvents: (start: string, end: string) => Promise<void>;
  selectEvent: (event: Event | null) => void;
  createEvent: (eventData: CreateEventRequest) => Promise<Event>;
  updateEvent: (eventId: string, eventData: UpdateEventRequest) => Promise<void>;
  deleteEvent: (eventId: string, deleteData: DeleteEventRequest) => Promise<void>;
  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
}

// Helper: Get date range for current view
function getDateRangeForView(view: CalendarView, date: Date): { start: Date; end: Date } {
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
      const getWeekStart = (d: Date) => {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      };
      const weekStart = getWeekStart(new Date(date));
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

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      selectedEvent: null,
      isLoading: false,
      error: null,
      currentView: "month",
      currentDate: new Date(),

      // Fetch events for a date range
      fetchEvents: async (start, end) => {
        set({ isLoading: true, error: null });
        try {
          const events = await apiGetEvents(start, end);
          set({ events, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch events",
            isLoading: false,
          });
        }
      },

      // Select event
      selectEvent: (event) => {
        set({ selectedEvent: event });
      },

      // Create new event
      createEvent: async (eventData) => {
        set({ isLoading: true, error: null });
        try {
          const newEvent = await apiCreateEvent(eventData);
          
          // Refetch events to get all occurrences
          const { currentDate, currentView } = get();
          const { start, end } = getDateRangeForView(currentView, currentDate);
          await get().fetchEvents(start.toISOString(), end.toISOString());
          
          set({ selectedEvent: newEvent, isLoading: false });
          return newEvent;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create event",
            isLoading: false,
          });
          throw error;
        }
      },

      // Update event
      updateEvent: async (eventId, eventData) => {
        set({ isLoading: true, error: null });
        try {
          await apiUpdateEvent(eventId, eventData);
          
          // Refetch events to update occurrences
          const { currentDate, currentView } = get();
          const { start, end } = getDateRangeForView(currentView, currentDate);
          await get().fetchEvents(start.toISOString(), end.toISOString());
          
          set({ selectedEvent: null, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update event",
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete event
      deleteEvent: async (eventId, deleteData) => {
        set({ isLoading: true, error: null });
        try {
          await apiDeleteEvent(eventId, deleteData);
          
          // Refetch events to update occurrences
          const { currentDate, currentView } = get();
          const { start, end } = getDateRangeForView(currentView, currentDate);
          await get().fetchEvents(start.toISOString(), end.toISOString());
          
          set({ selectedEvent: null, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete event",
            isLoading: false,
          });
          throw error;
        }
      },

      // Set current view
      setCurrentView: (view) => {
        set({ currentView: view });
      },

      // Set current date
      setCurrentDate: (date) => {
        set({ currentDate: date });
      },

      // Go to today
      goToToday: () => {
        set({ currentDate: new Date() });
      },
    }),
    {
      name: "event-storage",
      partialize: (state) => ({
        currentView: state.currentView,
        currentDate: state.currentDate,
      }),
    }
  )
);