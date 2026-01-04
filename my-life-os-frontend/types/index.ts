// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
    id: string;
    email: string;
    name: string;
    timezone?: string;
    createdAt: string;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface SetupRequest{
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse{
    token: string;
    user: User;
}

// ============================================
// API ERROR TYPES
// ============================================

export interface ApiError {
    error: string;
    code?: string;
    details?: Record<string, unknown>;
}