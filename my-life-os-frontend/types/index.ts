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
// API ERROR TYPES
// ============================================

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
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

// Time filters for task filtering
export type TimeFilter = "long_term" | "today" | "tomorrow" | "next_week" | "next_month" | "overdue";

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
// ROUTINE TYPES (Sprint 4)
// ============================================

export type RoutineFrequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
export type RoutineTimeType = "AM" | "PM" | "AllDay" | "Specific";

export interface YearlyDate {
  month: number; // 1-12
  day: number;   // 1-31
}

export interface Routine {
  id: string;
  userId: string;
  title: string;
  frequency: RoutineFrequency;
  weekday?: number;          // 0-6 for Weekly (0=Sunday)
  dayOfMonth?: number;       // 1-31 for Monthly
  quarterlyDay?: number;     // 1-31 for Quarterly
  yearlyDate?: YearlyDate;   // {month, day} for Yearly
  isSkippable: boolean;
  showStreak: boolean;
  timeType: RoutineTimeType;
  specificTime?: string;     // HH:mm format
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoutineRequest {
  title: string;
  frequency: RoutineFrequency;
  weekday?: number;
  dayOfMonth?: number;
  quarterlyDay?: number;
  yearlyDate?: YearlyDate;
  isSkippable: boolean;
  showStreak: boolean;
  timeType: RoutineTimeType;
  specificTime?: string;
}

export interface UpdateRoutineRequest {
  title?: string;
  frequency?: RoutineFrequency;
  weekday?: number;
  dayOfMonth?: number;
  quarterlyDay?: number;
  yearlyDate?: YearlyDate;
  isSkippable?: boolean;
  showStreak?: boolean;
  timeType?: RoutineTimeType;
  specificTime?: string;
}

export interface RoutinesResponse {
  routines: Routine[];
}

export interface RoutineResponse {
  routine: Routine;
  message?: string;
}

export interface RoutineCompletion {
  id: string;
  routineId: string;
  userId: string;
  completedAt: string;      // Date only (YYYY-MM-DD)
  status: "completed" | "skipped";
  createdAt: string;
}

// ============================================
// SCHEDULE TYPES (Sprint 4)
// ============================================

export type ScheduleDomain = 
  | "Personal"
  | "Family"
  | "Working"
  | "University"
  | "Health"
  | "Social"
  | "Coding"
  | "Holidays";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type UpdateType = "single" | "future";

export type DeleteType = "single" | "future" | "all";

export interface ScheduleEvent {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: ScheduleDomain;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  isAllDay: boolean;
  location: string;
  linkedTaskId?: string;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string; // ISO 8601 format
  recurrenceDays?: number[]; // Array of weekday numbers (0=Sunday, 1=Monday, etc.)
  parentEventId?: string;
  exceptionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleEventRequest {
  title: string;
  description?: string;
  domain: ScheduleDomain;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  isAllDay?: boolean;
  location?: string;
  linkedTaskId?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: string; // ISO 8601 format
  recurrenceDays?: number[]; // Array of weekday numbers (0=Sunday, 1=Monday, etc.)
}

export interface UpdateScheduleEventRequest {
  title: string;
  description?: string;
  domain: ScheduleDomain;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  isAllDay?: boolean;
  location?: string;
  linkedTaskId?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: string; // ISO 8601 format
  recurrenceDays?: number[]; // Array of weekday numbers (0=Sunday, 1=Monday, etc.)
  updateType?: UpdateType; // "single", "future", or "all"
  instanceDate?: string; // ISO 8601 format - original instance date for recurring event updates
}

export interface ScheduleEventsResponse {
  events: ScheduleEvent[];
}

export interface ScheduleEventResponse {
  event: ScheduleEvent;
  message?: string;
  conflicts?: ScheduleEvent[]; // Returned when creating an event
}