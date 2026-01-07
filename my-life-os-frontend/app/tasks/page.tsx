"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { QuickAddDialog } from "@/components/tasks/quick-add-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { useTaskStore } from "@/lib/store/task-store";

export default function TasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { fetchTasksWithFilters } = useTaskStore();

  useEffect(() => {
    // Fetch ALL tasks without filter for debugging
    fetchTasksWithFilters(undefined, undefined, undefined);
  }, [fetchTasksWithFilters]);

  return (
    <AuthGuard>
      {/* Burger Menu */}
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Quick Add Dialog */}
      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Main Content - mehr padding rechts */}
      <div className="min-h-screen py-8 pl-36 pr-48">
        {/* 3 Separate Boxen nebeneinander */}
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left: Filter Sidebar (280px) - rund LINKS, fixed height */}
          <aside className="w-80 flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-l-lg p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </aside>

          {/* Middle: Task List (flex-1) - SCHWARZ, SCROLLBAR hier */}
          <main className="flex-1 min-w-0 bg-background border-y-2 border-muted-foreground/20 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Tasks</h1>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                + New Task
              </button>
            </div>
            
            {/* Task List */}
            <TaskList />
          </main>

          {/* Right: Task Details (450px) - rund RECHTS, fixed height */}
          <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Task Details</h2>
            <p className="text-sm text-muted-foreground">Select a task to view details</p>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}