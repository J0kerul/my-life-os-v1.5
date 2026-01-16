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
// SCHEDULE/EVENT TYPES (Sprint 5)
// ============================================

export type EventDomain = 
  | "Work"
  | "University"
  | "Personal"
  | "Coding Time"
  | "Study"
  | "Health"
  | "Social"
  | "Holidays"
  | "Travel"
  | "Maintenance"
  | "Entertainment"
  | "Family";

export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly";

export type EditScope = "this" | "following" | "all";

export type DeleteScope = "this" | "following" | "all";

export type CalendarView = "month" | "week" | "day" | "agenda";

export interface Event {
  id: string;
  userId: string;
  title: string;
  startDate: string;        // ISO 8601 format
  endDate: string | null;   // ISO 8601 format, null = All Day
  allDay: boolean;
  domain: EventDomain;
  isRecurring: boolean;
  recurrenceType: RecurrenceType | null;
  recurrenceEnd: string | null;  // ISO 8601 format, null = never ends
  recurrenceDays: string | null; // JSON array: ["monday","wednesday"]
  hideFromAgenda: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventException {
  id: string;
  eventId: string;
  userId: string;
  originalDate: string;     // ISO 8601 format
  type: "deleted" | "modified";
  modifiedTitle?: string | null;
  modifiedStartDate?: string | null;
  modifiedEndDate?: string | null;
  modifiedDomain?: string | null;
  modifiedAllDay?: boolean | null;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  startDate: string;        // ISO 8601 format
  endDate?: string | null;  // ISO 8601 format
  allDay?: boolean;
  domain: EventDomain;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType | null;
  recurrenceEnd?: string | null;
  recurrenceDays?: string | null; // JSON array: ["monday","wednesday"]
  hideFromAgenda?: boolean;
}

export interface UpdateEventRequest {
  occurrenceDate?: string | null; // Required for "this" or "following" scope
  editScope: EditScope;
  title: string;
  startDate: string;
  endDate?: string | null;
  allDay?: boolean;
  domain: EventDomain;
  recurrenceType?: RecurrenceType | null;
  recurrenceEnd?: string | null;
  recurrenceDays?: string | null;
  hideFromAgenda?: boolean;
}

export interface DeleteEventRequest {
  occurrenceDate?: string | null; // Required for "this" or "following" scope
  deleteScope: DeleteScope;
}

export interface EventsResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event;
  message?: string;
}

// ============================================
// PROJECT MANAGER TYPES
// ============================================

// Category
export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

// Tech Stack Item
export interface TechStackItem {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  createdAt: string;
  category?: Category; // Populated from backend
}

export interface CreateTechStackItemRequest {
  categoryId: string;
  name: string;
}

export interface UpdateTechStackItemRequest {
  categoryId: string;
  name: string;
}

// Project Status
export type ProjectStatus = 
  | "Idea"
  | "Planning" 
  | "Active"
  | "Debugging"
  | "Testing"
  | "OnHold"
  | "Finished"
  | "Abandoned";

// Project
export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStack: TechStackItem[];
  tasks: ProjectTask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStackIds: string[];
}

export interface UpdateProjectRequest {
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStackIds: string[];
}

// Project Task Assignment
export interface ProjectTask {
  id: string;
  projectId: string;
  taskId: string;
  assignedAt: string;
  task?: Task; // Populated from backend
}

export interface AssignTaskRequest {
  taskId: string;
}