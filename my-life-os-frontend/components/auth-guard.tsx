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
      console.log("🔐 AuthGuard: Starting verification...");
      try {
        // ALWAYS check with backend - NEVER trust localStorage!
        await checkAuth();
        
        // After backend check, verify the state was actually set
        const currentState = useAuthStore.getState().isAuthenticated;
        console.log("🔐 AuthGuard: Backend check complete. isAuthenticated =", currentState);
        
        if (!currentState) {
          // Backend rejected - redirect to homepage (will check if setup needed)
          console.log("🔐 AuthGuard: Not authenticated, redirecting to homepage");
          router.push("/");
        } else {
          console.log("🔐 AuthGuard: Authenticated! Rendering page.");
        }
      } catch (error) {
        // Auth check failed - redirect to homepage (will check if setup needed)
        console.error("🔐 AuthGuard: Auth verification failed:", error);
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };

    // ALWAYS verify with backend, even if localStorage says authenticated
    verifyAuth();
  }, [checkAuth, router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // After verification, check auth state one more time
  if (!isAuthenticated) {
    // Not authenticated - don't render anything (redirect is happening)
    return null;
  }

  // Verified and authenticated - render children
  return <>{children}</>;
}