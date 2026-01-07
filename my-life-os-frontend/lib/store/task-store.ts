import { create } from "zustand";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskDomain,
  TaskStatus,
  TimeFilter,
} from "@/types";
import { 
  getTasks as apiGetTasks, 
  createTask as apiCreateTask, 
  updateTask as apiUpdateTask, 
  toggleTaskStatus as apiToggleTaskStatus, 
  deleteTask as apiDeleteTask 
} from "@/lib/api/tasks";

interface TaskState {
  // State
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Filters
  domainFilter: TaskDomain | null;
  statusFilter: TaskStatus | null;
  timeFilter: TimeFilter | null;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchTasksWithFilters: (
    domain?: TaskDomain,
    status?: TaskStatus,
    timeFilter?: TimeFilter | null
  ) => Promise<void>;
  selectTask: (task: Task | null) => void;
  createTask: (taskData: CreateTaskRequest) => Promise<Task>;
  updateTask: (taskId: string, taskData: UpdateTaskRequest) => Promise<Task>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setDomainFilter: (domain: TaskDomain | null) => void;
  setStatusFilter: (status: TaskStatus | null) => void;
  setTimeFilter: (timeFilter: TimeFilter | null) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  domainFilter: null,
  statusFilter: null, // Default: Show all tasks (Todo + Done)
  timeFilter: null, // Default: Show all tasks

  // Fetch all tasks (no filters)
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await apiGetTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  // Fetch tasks with filters
  fetchTasksWithFilters: async (domain?, status?, timeFilter?) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await apiGetTasks(domain, status, timeFilter);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  // Select a task for detail view
  selectTask: (task) => {
    set({ selectedTask: task });
  },

  // Create new task
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await apiCreateTask(taskData);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        selectedTask: newTask,
        isLoading: false,
      }));
      return newTask;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await apiUpdateTask(taskId, taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        selectedTask:
          state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
        isLoading: false,
      }));
      return updatedTask;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Toggle task status (Todo <-> Done)
  toggleTaskStatus: async (taskId) => {
    try {
      const updatedTask = await apiToggleTaskStatus(taskId);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        selectedTask:
          state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to toggle task status",
      });
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        selectedTask:
          state.selectedTask?.id === taskId ? null : state.selectedTask,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Set filters
  setDomainFilter: (domain) => {
    set({ domainFilter: domain });
    const { statusFilter, timeFilter } = get();
    get().fetchTasksWithFilters(domain || undefined, statusFilter || undefined, timeFilter);
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    const { domainFilter, timeFilter } = get();
    get().fetchTasksWithFilters(domainFilter || undefined, status || undefined, timeFilter);
  },

  setTimeFilter: (timeFilter) => {
    set({ timeFilter });
    const { domainFilter, statusFilter } = get();
    get().fetchTasksWithFilters(domainFilter || undefined, statusFilter || undefined, timeFilter);
  },

  clearFilters: () => {
    set({ domainFilter: null, statusFilter: null, timeFilter: null });
    get().fetchTasksWithFilters(undefined, undefined, null);
  },
}));