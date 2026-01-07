import type {
  StatusResponse,
  SetupRequest,
  LoginRequest,
  AuthResponse,
  User,
  ApiError,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Helper function for API calls with automatic cookie handling
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include", // CRITICAL: Send cookies automatically!
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    const err = new Error(error.error || "An error occurred") as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  return response.json();
}

// Check if setup is needed
export async function checkStatus(): Promise<StatusResponse> {
  return apiCall<StatusResponse>("/status");
}

// Create initial user account
export async function setupUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiCall<AuthResponse>("/setup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiCall<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Refresh tokens (cookies are sent automatically)
export async function refreshToken(): Promise<{ message: string }> {
  return apiCall<{ message: string }>("/auth/refresh", {
    method: "POST",
  });
}

// Logout user
export async function logoutUser(): Promise<{ message: string }> {
  return apiCall<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

// Get current user (with auto-retry on 401)
export async function getCurrentUser(): Promise<{ id: string }> {
  try {
    return await apiCall<{ id: string }>("/auth/me");
  } catch (error) {
    // If 401 Unauthorized, try refreshing token and retry once
    if (error instanceof Error && 'status' in error && (error as any).status === 401) {
      try {
        await refreshToken();
        // Retry after successful refresh
        return await apiCall<{ id: string }>("/auth/me");
      } catch (refreshError) {
        // Refresh failed, re-throw original error
        throw error;
      }
    }
    throw error;
  }
}