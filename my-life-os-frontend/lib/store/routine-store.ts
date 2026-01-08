import { create } from "zustand";
import type {
  Routine,
  CreateRoutineRequest,
  UpdateRoutineRequest,
  RoutineFrequency,
} from "@/types";
import { 
  getRoutines as apiGetRoutines,
  getTodaysRoutines as apiGetTodaysRoutines,
  createRoutine as apiCreateRoutine, 
  updateRoutine as apiUpdateRoutine,
  completeRoutine as apiCompleteRoutine,
  skipRoutine as apiSkipRoutine,
  deleteRoutine as apiDeleteRoutine 
} from "@/lib/api/routines";

interface RoutineState {
  // State
  routines: Routine[];
  selectedRoutine: Routine | null;
  isLoading: boolean;
  error: string | null;

  // Filters
  frequencyFilter: RoutineFrequency | null;

  // Actions
  fetchRoutines: () => Promise<void>;
  fetchRoutinesWithFilter: (frequency?: RoutineFrequency) => Promise<void>;
  fetchTodaysRoutines: () => Promise<void>;
  selectRoutine: (routine: Routine | null) => void;
  createRoutine: (routineData: CreateRoutineRequest) => Promise<Routine>;
  updateRoutine: (routineId: string, routineData: UpdateRoutineRequest) => Promise<Routine>;
  completeRoutine: (routineId: string) => Promise<void>;
  skipRoutine: (routineId: string) => Promise<void>;
  deleteRoutine: (routineId: string) => Promise<void>;
  setFrequencyFilter: (frequency: RoutineFrequency | null) => void;
  clearFilters: () => void;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
  // Initial state
  routines: [],
  selectedRoutine: null,
  isLoading: false,
  error: null,
  frequencyFilter: null,

  // Fetch all routines (no filters)
  fetchRoutines: async () => {
    set({ isLoading: true, error: null });
    try {
      const routines = await apiGetRoutines();
      set({ routines, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch routines",
        isLoading: false,
      });
    }
  },

  // Fetch routines with frequency filter
  fetchRoutinesWithFilter: async (frequency?) => {
    set({ isLoading: true, error: null });
    try {
      const routines = await apiGetRoutines(frequency);
      set({ routines, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch routines",
        isLoading: false,
      });
    }
  },

  // Fetch today's routines (based on frequency matching)
  fetchTodaysRoutines: async () => {
    set({ isLoading: true, error: null });
    try {
      const routines = await apiGetTodaysRoutines();
      set({ routines, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch today's routines",
        isLoading: false,
      });
    }
  },

  // Select a routine for detail view
  selectRoutine: (routine) => {
    set({ selectedRoutine: routine });
  },

  // Create new routine
  createRoutine: async (routineData) => {
    set({ isLoading: true, error: null });
    try {
      const newRoutine = await apiCreateRoutine(routineData);
      set((state) => ({
        routines: [newRoutine, ...state.routines],
        selectedRoutine: newRoutine,
        isLoading: false,
      }));
      return newRoutine;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create routine",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update routine
  updateRoutine: async (routineId, routineData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRoutine = await apiUpdateRoutine(routineId, routineData);
      set((state) => ({
        routines: state.routines.map((r) => (r.id === routineId ? updatedRoutine : r)),
        selectedRoutine:
          state.selectedRoutine?.id === routineId ? updatedRoutine : state.selectedRoutine,
        isLoading: false,
      }));
      return updatedRoutine;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update routine",
        isLoading: false,
      });
      throw error;
    }
  },

  // Complete routine (marks as done for today, updates streak)
  completeRoutine: async (routineId) => {
    try {
      await apiCompleteRoutine(routineId);
      // Re-fetch routines to get updated streak
      const { frequencyFilter } = get();
      await get().fetchRoutinesWithFilter(frequencyFilter || undefined);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to complete routine",
      });
      throw error;
    }
  },

  // Skip routine (marks as skipped for today, may affect streak)
  skipRoutine: async (routineId) => {
    try {
      await apiSkipRoutine(routineId);
      // Re-fetch routines to get updated streak
      const { frequencyFilter } = get();
      await get().fetchRoutinesWithFilter(frequencyFilter || undefined);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to skip routine",
      });
      throw error;
    }
  },

  // Delete routine
  deleteRoutine: async (routineId) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteRoutine(routineId);
      set((state) => ({
        routines: state.routines.filter((r) => r.id !== routineId),
        selectedRoutine:
          state.selectedRoutine?.id === routineId ? null : state.selectedRoutine,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete routine",
        isLoading: false,
      });
      throw error;
    }
  },

  // Set frequency filter
  setFrequencyFilter: (frequency) => {
    set({ frequencyFilter: frequency });
    get().fetchRoutinesWithFilter(frequency || undefined);
  },

  // Clear all filters
  clearFilters: () => {
    set({ frequencyFilter: null });
    get().fetchRoutinesWithFilter(undefined);
  },
}));