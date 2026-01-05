"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if user is authenticated by calling backend
        await checkAuth();
      } catch (error) {
        // Not authenticated, redirect to login
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    // Only check if not already authenticated
    if (!isAuthenticated) {
      verifyAuth();
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, checkAuth, router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, don't render anything (will redirect)
  return null;
}