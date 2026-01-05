import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import * as authAPI from "@/lib/api/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user and update authentication status
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // Login user
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.loginUser(email, password);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout user
      logout: async () => {
        try {
          await authAPI.logoutUser();
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          // Even if logout fails on backend, clear local state
          set({
            user: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Check if user is authenticated (used on app load)
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const userData = await authAPI.getCurrentUser();
          // We only get ID back, so we need to construct a minimal user object
          // In a real app, the backend would return full user data
          set({
            user: {
              id: userData.id,
              email: "", // Backend doesn't return this in /me endpoint
              name: "", // Backend doesn't return this in /me endpoint
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Not authenticated or token expired
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      // Only persist user and isAuthenticated, not isLoading
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);