"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkStatus } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        // If already authenticated, go to dashboard
        if (isAuthenticated) {
          router.push("/dashboard");
          return;
        }

        // Check if setup is needed
        const status = await checkStatus();
        
        if (status.needsSetup) {
          // No users exist, redirect to setup
          router.push("/setup");
        } else {
          // Users exist, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Status check failed:", error);
        // On error, default to login
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialStatus();
  }, [router, isAuthenticated]);

  // Show loading state while checking
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">MyLifeOS</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}