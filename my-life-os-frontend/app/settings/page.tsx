"use client";

import { Settings } from "lucide-react";
import { useState } from "react";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import TechStackManagerDialog from "@/components/settings/tech-stack-manager-dialog";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTechStackManager, setShowTechStackManager] = useState(false);

  return (
    <>
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen bg-background px-36 py-8">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Main Settings Box */}
          <div className="flex-1 bg-card border-2 border-muted-foreground/20 rounded-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              </div>
              <p className="text-muted-foreground">
                Manage your application settings and preferences
              </p>
            </div>

            {/* Settings List */}
            <div className="space-y-4 max-w-4xl">
              {/* Tech Stack Management Setting */}
              <div
                onClick={() => setShowTechStackManager(true)}
                className="bg-background border-2 border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      Manage Tech Stack
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Organize your technologies into categories and manage your
                      tech stack items
                    </p>
                  </div>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Manager Modal */}
        {showTechStackManager && (
          <TechStackManagerDialog
            onClose={() => setShowTechStackManager(false)}
          />
        )}
      </div>
    </>
  );
}
