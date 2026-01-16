"use client";

import { useProjectStore } from "@/lib/store/project-store";
import { ProjectItem } from "./project-item";

export function ProjectList() {
  const { projects, isLoading, selectedProject, selectProject } =
    useProjectStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">No projects yet</p>
          <p className="text-sm text-muted-foreground">
            Click "New Project" to create your first project
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        {projects.length} {projects.length === 1 ? "project" : "projects"}
      </div>

      {/* Project List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            isSelected={selectedProject?.id === project.id}
            onClick={() => selectProject(project)}
          />
        ))}
      </div>
    </div>
  );
}
