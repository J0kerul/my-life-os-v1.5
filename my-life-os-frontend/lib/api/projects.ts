import { Project, ProjectTask, CreateProjectRequest, UpdateProjectRequest, AssignTaskRequest } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Get all projects (with optional filters)
export async function getProjects(status?: string, techStackIds?: string[]): Promise<{ projects: Project[] }> {
  const token = getAuthToken();
  
  let url = `${API_URL}/projects`;
  const params = new URLSearchParams();
  
  if (status) params.append("status", status);
  if (techStackIds && techStackIds.length > 0) {
    params.append("techStackIds", techStackIds.join(","));
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch projects");
  }

  return response.json();
}

// Get single project
export async function getProject(id: string): Promise<{ project: Project }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch project");
  }

  return response.json();
}

// Create project
export async function createProject(data: CreateProjectRequest): Promise<{ message: string; project: Project }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
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

// Update project
export async function updateProject(id: string, data: UpdateProjectRequest): Promise<{ message: string; project: Project }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
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

// Delete project
export async function deleteProject(id: string): Promise<{ message: string }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete project");
  }

  return response.json();
}

// Assign task to project
export async function assignTaskToProject(projectId: string, data: AssignTaskRequest): Promise<{ message: string }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
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

// Unassign task from project
export async function unassignTaskFromProject(projectId: string, taskId: string): Promise<{ message: string }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to unassign task");
  }

  return response.json();
}

// Get project tasks
export async function getProjectTasks(projectId: string): Promise<{ tasks: ProjectTask[] }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch project tasks");
  }

  return response.json();
}