// ============================================
// USER & AUTH TYPES (Sprint 1)
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  timezone?: string;
}

export interface SetupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  // Note: Tokens are in HttpOnly cookies, not in response body!
}

export interface StatusResponse {
  needsSetup: boolean;
  version: string;
}

// ============================================
// TASK TYPES (Sprint 3)
// ============================================

export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Todo" | "Done";
export type TaskDomain = 
  | "Work"
  | "University"
  | "Coding Project"
  | "Personal Project"
  | "Goals"
  | "Finances"
  | "Household"
  | "Health";

export type TimeFilter = "long_term" | "tomorrow" | "next_week" | "next_month";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  domain: TaskDomain;
  deadline: string | null; // ISO 8601 format
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  domain: TaskDomain;
  deadline?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  domain?: TaskDomain;
  deadline?: string | null;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
  message?: string;
}

// ============================================
// API ERROR TYPES
// ============================================

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}