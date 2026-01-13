import { create } from "zustand";
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  DeleteEventRequest,
  CalendarView,
} from "@/types";
import {
  getEvents as apiGetEvents,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
} from "@/lib/api/events";

interface EventState {
  // State
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;

  // Calendar state
  currentView: CalendarView;
  currentDate: Date; // The date the calendar is focused on

  // Actions
  fetchEvents: (start: string, end: string) => Promise<void>;
  selectEvent: (event: Event | null) => void;
  createEvent: (eventData: CreateEventRequest) => Promise<Event>;
  updateEvent: (eventId: string, eventData: UpdateEventRequest) => Promise<Event>;
  deleteEvent: (eventId: string, deleteData: DeleteEventRequest) => Promise<void>;
  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  // Initial state
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  currentView: "month",
  currentDate: new Date(),

  // Fetch events in date range
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

  // Select an event for detail view
  selectEvent: (event) => {
    set({ selectedEvent: event });
  },

  // Create new event
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const newEvent = await apiCreateEvent(eventData);
      set((state) => ({
        events: [...state.events, newEvent],
        selectedEvent: newEvent,
        isLoading: false,
      }));
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
      const updatedEvent = await apiUpdateEvent(eventId, eventData);
      
      // Refetch events to get updated occurrences
      const { currentDate, currentView } = get();
      // Calculate date range based on current view
      // This will be implemented when we build the calendar views
      
      set((state) => ({
        selectedEvent:
          state.selectedEvent?.id === eventId ? updatedEvent : state.selectedEvent,
        isLoading: false,
      }));
      
      return updatedEvent;
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
      
      // Refetch events to get updated occurrences
      const { currentDate, currentView } = get();
      // This will be implemented when we build the calendar views
      
      set((state) => ({
        selectedEvent:
          state.selectedEvent?.id === eventId ? null : state.selectedEvent,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete event",
        isLoading: false,
      });
      throw error;
    }
  },

  // Set calendar view
  setCurrentView: (view) => {
    set({ currentView: view });
  },

  // Set current date (what the calendar is focused on)
  setCurrentDate: (date) => {
    set({ currentDate: date });
  },

  // Go to today
  goToToday: () => {
    set({ currentDate: new Date() });
  },
}));