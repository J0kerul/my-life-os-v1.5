"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { QuickAddDialog } from "@/components/projects/quick-add-dialog";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectFilterSidebar } from "@/components/projects/project-filter-sidebar";
import { ProjectDetailView } from "@/components/projects/project-detail-view";
import { useProjectStore } from "@/lib/store/project-store";

export default function ProjectsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { fetchProjects } = useProjectStore();

  useEffect(() => {
    // Fetch all projects on mount
    fetchProjects();
  }, [fetchProjects]);

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
            <ProjectFilterSidebar />
          </aside>

          <main className="flex-1 min-w-0 bg-background border-y-2 border-muted-foreground/20 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Projects</h1>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                + New Project
              </button>
            </div>
            <ProjectList />
          </main>

          <aside className="w-[450px] flex-shrink-0 bg-card border-2 border-muted-foreground/20 rounded-r-lg p-6 overflow-y-auto">
            <ProjectDetailView />
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
