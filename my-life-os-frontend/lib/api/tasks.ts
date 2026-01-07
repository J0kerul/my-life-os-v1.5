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

// Helper: Refresh token if needed
async function refreshTokenIfNeeded(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    // Refresh failed - user needs to login again
    window.location.href = "/login";
    throw error;
  }
}

// Helper: Fetch with auto-retry on 401
async function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // If 401 (Unauthorized), try refreshing token and retry once
  if (response.status === 401) {
    await refreshTokenIfNeeded();
    
    // Retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return response;
}

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

  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetchWithAuth(`${API_BASE}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetchWithAuth(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetchWithAuth(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetchWithAuth(`${API_BASE}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetchWithAuth(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete task");
  }
}