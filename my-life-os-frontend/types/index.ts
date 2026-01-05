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