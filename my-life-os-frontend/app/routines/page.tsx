"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { QuickAddDialog } from "@/components/routines/quick-add-dialog";
import { RoutineList } from "@/components/routines/routines-list";
import { RoutineFilterSidebar } from "@/components/routines/routine-filter-sidebar";
import { RoutineDetailView } from "@/components/routines/routine-detail-view";
import { useRoutineStore } from "@/lib/store/routine-store";

export default function RoutinesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { fetchRoutines } = useRoutineStore();

  useEffect(() => {
    // Fetch all routines on mount
    fetchRoutines();
  }, [fetchRoutines]);

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
            <RoutineFilterSidebar />
          </aside>

          <main className="flex-1 min-w-0 bg-background border-y-2 border-muted-foreground/20 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Daily Routines</h1>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                + New Routine
              </button>
            </div>
            <RoutineList />
          </main>

          <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
            <RoutineDetailView />
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
