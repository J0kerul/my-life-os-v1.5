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
    throw new Error(error.error || "An error occurred");
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

// Get current user
export async function getCurrentUser(): Promise<{ id: string }> {
  return apiCall<{ id: string }>("/auth/me");
}