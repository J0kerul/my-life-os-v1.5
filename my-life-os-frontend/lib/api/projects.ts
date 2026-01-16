import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  AssignTaskRequest,
  ProjectStatus,
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

// Get all projects (with optional filters)
export async function getProjects(status?: ProjectStatus, techStackIds?: string[]) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (techStackIds && techStackIds.length > 0) {
    params.append("techStackIds", techStackIds.join(","));
  }

  const queryString = params.toString();
  const url = `${API_BASE}/projects${queryString ? `?${queryString}` : ""}`;

  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch projects");
  }

  return response.json();
}

// Create a new project
export async function createProject(data: CreateProjectRequest) {
  const response = await fetchWithAuth(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create project");
  }

  return response.json();
}

// Update an existing project
export async function updateProject(projectId: string, data: UpdateProjectRequest) {
  const response = await fetchWithAuth(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update project");
  }

  return response.json();
}

// Delete a project
export async function deleteProject(projectId: string) {
  const response = await fetchWithAuth(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete project");
  }

  return response.json();
}

// Assign a task to a project
export async function assignTaskToProject(projectId: string, data: AssignTaskRequest) {
  const response = await fetchWithAuth(`${API_BASE}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to assign task");
  }

  return response.json();
}

// Unassign a task from a project
export async function unassignTaskFromProject(projectId: string, taskId: string) {
  const response = await fetchWithAuth(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to unassign task");
  }

  return response.json();
}

// Get all tasks assigned to a project
export async function getProjectTasks(projectId: string) {
  const response = await fetchWithAuth(`${API_BASE}/projects/${projectId}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch project tasks");
  }

  return response.json();
}