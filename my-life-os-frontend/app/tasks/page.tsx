"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { QuickAddDialog } from "@/components/tasks/quick-add-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { TaskFilterSidebar } from "@/components/tasks/task-filter-sidebar";
import { TaskDetailView } from "@/components/tasks/task-detail-view";
import { useTaskStore } from "@/lib/store/task-store";

export default function TasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { fetchTasksWithFilters } = useTaskStore();

  useEffect(() => {
    // Fetch all tasks on mount (including completed)
    fetchTasksWithFilters(undefined, undefined, null);
  }, [fetchTasksWithFilters]);

  return (
    <AuthGuard>
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <div className="min-h-screen py-8 pl-36 pr-48">
        <div className="flex h-[calc(100vh-4rem)]">
          <aside className="w-80 flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-l-lg p-6 overflow-y-auto">
            <TaskFilterSidebar />
          </aside>

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
            <TaskList />
          </main>

          <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
            <TaskDetailView />
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
