"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to login
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
            </h1>
            <p className="text-muted-foreground">
              Your personal life operating system
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="glass glass-border rounded-lg p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Dashboard Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              Your widgets and productivity tools will appear here
            </p>
            
            {/* User Info */}
            {user && (
              <div className="inline-block bg-secondary/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-medium">{user.email || user.name || "User"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}