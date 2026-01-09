import { create } from "zustand";
import type {
  ScheduleEvent,
  CreateScheduleEventRequest,
  UpdateScheduleEventRequest,
  ScheduleDomain,
  CalendarView,
  DeleteType,
} from "@/types";
import {
  getEvents as apiGetEvents,
  getEvent as apiGetEvent,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
} from "@/lib/api/schedule";

interface ScheduleState {
  // State
  events: ScheduleEvent[];
  selectedEvent: ScheduleEvent | null;
  isLoading: boolean;
  error: string | null;
  conflicts: ScheduleEvent[]; // Conflicts from last create/update

  // View & Filter State
  currentView: CalendarView;
  currentDate: Date; // Current date for calendar navigation
  domainFilters: Set<ScheduleDomain>; // Multiple domains can be selected

  // Date range for current view
  rangeStart: string | null; // ISO 8601
  rangeEnd: string | null;   // ISO 8601

  // Actions
  fetchEvents: (startDate: string, endDate: string) => Promise<void>;
  selectEvent: (event: ScheduleEvent | null) => void;
  createEvent: (eventData: CreateScheduleEventRequest) => Promise<ScheduleEvent>;
  updateEvent: (eventId: string, eventData: UpdateScheduleEventRequest, updateType?: DeleteType) => Promise<ScheduleEvent>;
  deleteEvent: (eventId: string, deleteType?: DeleteType, instanceDate?: string) => Promise<void>;

  // View & Filter Actions
  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  toggleDomainFilter: (domain: ScheduleDomain) => void;
  clearDomainFilters: () => void;
  setDateRange: (startDate: string, endDate: string) => void;
  
  // Helper to get filtered events
  getFilteredEvents: () => ScheduleEvent[];
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  // Initial state
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  conflicts: [],
  currentView: "month",
  currentDate: new Date(),
  domainFilters: new Set(),
  rangeStart: null,
  rangeEnd: null,

  // Fetch events in date range
  fetchEvents: async (startDate, endDate) => {
    set({ isLoading: true, error: null, rangeStart: startDate, rangeEnd: endDate });
    try {
      const events = await apiGetEvents(startDate, endDate);
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
      const { event: newEvent, conflicts } = await apiCreateEvent(eventData);
      set((state) => ({
        events: [...state.events, newEvent],
        selectedEvent: newEvent,
        conflicts,
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
  updateEvent: async (eventId, eventData, updateType) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEvent = await apiUpdateEvent(eventId, eventData, updateType);
      
      // If updateType is "single", the backend creates an exception
      // We need to refetch to get the correct expanded events
      const { rangeStart, rangeEnd } = get();
      if (rangeStart && rangeEnd) {
        await get().fetchEvents(rangeStart, rangeEnd);
      }

      set({
        selectedEvent: updatedEvent,
        isLoading: false,
      });
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
  deleteEvent: async (eventId, deleteType, instanceDate) => {
    set({ isLoading: true, error: null });
    try {
      // If no deleteType specified, auto-detect: use "all" for recurring events
      let finalDeleteType = deleteType;
      if (!finalDeleteType) {
        const { events } = get();
        const event = events.find(e => e.id === eventId);
        finalDeleteType = (event && event.recurrence !== "none") ? "all" : "single";
      }
      
      await apiDeleteEvent(eventId, finalDeleteType, instanceDate);
      
      // Refetch events to get correct state after deletion
      const { rangeStart, rangeEnd } = get();
      if (rangeStart && rangeEnd) {
        await get().fetchEvents(rangeStart, rangeEnd);
      }

      set((state) => ({
        selectedEvent: state.selectedEvent?.id === eventId ? null : state.selectedEvent,
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

  // Set current view (month, week, day, agenda)
  setCurrentView: (view) => {
    set({ currentView: view });
  },

  // Set current date for calendar navigation
  setCurrentDate: (date) => {
    set({ currentDate: date });
  },

  // Toggle domain filter
  toggleDomainFilter: (domain) => {
    set((state) => {
      const newFilters = new Set(state.domainFilters);
      if (newFilters.has(domain)) {
        newFilters.delete(domain);
      } else {
        newFilters.add(domain);
      }
      return { domainFilters: newFilters };
    });
  },

  // Clear all domain filters
  clearDomainFilters: () => {
    set({ domainFilters: new Set() });
  },

  // Set date range
  setDateRange: (startDate, endDate) => {
    set({ rangeStart: startDate, rangeEnd: endDate });
  },

  // Get filtered events based on domain filters
  getFilteredEvents: () => {
    const { events, domainFilters } = get();
    
    // If no filters, return all events
    if (domainFilters.size === 0) {
      return events;
    }
    
    // Filter by selected domains
    return events.filter((event) => domainFilters.has(event.domain));
  },
}));
