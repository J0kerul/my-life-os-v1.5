import type {
  Routine,
  CreateRoutineRequest,
  UpdateRoutineRequest,
  RoutinesResponse,
  RoutineResponse,
  RoutineFrequency,
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

// Get all routines with optional frequency filter
export async function getRoutines(
  frequency?: RoutineFrequency
): Promise<Routine[]> {
  const params = new URLSearchParams();
  if (frequency) params.append("frequency", frequency);

  const queryString = params.toString();
  const url = `${API_BASE}/routines${queryString ? `?${queryString}` : ""}`;

  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch routines");
  }

  const data: RoutinesResponse = await response.json();
  return data.routines || [];
}

// Get today's routines (based on frequency matching)
export async function getTodaysRoutines(): Promise<Routine[]> {
  const response = await fetchWithAuth(`${API_BASE}/routines/today`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch today's routines");
  }

  const data: RoutinesResponse = await response.json();
  return data.routines || [];
}

// Get single routine
export async function getRoutine(routineId: string): Promise<Routine> {
  const response = await fetchWithAuth(`${API_BASE}/routines/${routineId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch routine");
  }

  const data: RoutineResponse = await response.json();
  return data.routine;
}

// Create new routine
export async function createRoutine(
  routineData: CreateRoutineRequest
): Promise<Routine> {
  const response = await fetchWithAuth(`${API_BASE}/routines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(routineData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create routine");
  }

  const data: RoutineResponse = await response.json();
  return data.routine;
}

// Update routine
export async function updateRoutine(
  routineId: string,
  routineData: UpdateRoutineRequest
): Promise<Routine> {
  const response = await fetchWithAuth(`${API_BASE}/routines/${routineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(routineData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update routine");
  }

  const data: RoutineResponse = await response.json();
  return data.routine;
}

// Complete routine (mark as done for today)
export async function completeRoutine(routineId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/routines/${routineId}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to complete routine");
  }
}

// Skip routine (mark as skipped for today)
export async function skipRoutine(routineId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/routines/${routineId}/skip`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to skip routine");
  }
}

// Delete routine
export async function deleteRoutine(routineId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/routines/${routineId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete routine");
  }
}