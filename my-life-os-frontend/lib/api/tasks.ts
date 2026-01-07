import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  TaskResponse,
  TaskDomain,
  TaskStatus,
  TimeFilter,
} from "@/types";

const API_BASE = "/api";

// Get all tasks with optional filters
export async function getTasks(
  domain?: TaskDomain,
  status?: TaskStatus,
  timeFilter?: TimeFilter
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (domain) params.append("domain", domain);
  if (status) params.append("status", status);
  if (timeFilter) params.append("time_filter", timeFilter);

  const queryString = params.toString();
  const url = `${API_BASE}/tasks${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tasks");
  }

  const data: TasksResponse = await response.json();
  return data.tasks || [];
}

// Get single task
export async function getTask(taskId: string): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch task");
  }

  const data: TaskResponse = await response.json();
  return data.task;
}

// Create new task
export async function createTask(
  taskData: CreateTaskRequest
): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create task");
  }

  const data: TaskResponse = await response.json();
  return data.task;
}

// Update task
export async function updateTask(
  taskId: string,
  taskData: UpdateTaskRequest
): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task");
  }

  const data: TaskResponse = await response.json();
  return data.task;
}

// Toggle task status (Todo <-> Done)
export async function toggleTaskStatus(taskId: string): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to toggle task status");
  }

  const data: TaskResponse = await response.json();
  return data.task;
}

// Delete task
export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete task");
  }
}