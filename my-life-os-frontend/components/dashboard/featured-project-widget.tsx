"use client";

import { useState, useEffect } from "react";
import {
  FolderKanban,
  ChevronDown,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import { useProjectStore } from "@/lib/store/project-store";
import { useTaskStore } from "@/lib/store/task-store";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";

export function FeaturedProjectWidget() {
  const { projects, fetchProjects, projectTasks, fetchProjectTasks } =
    useProjectStore();
  const { fetchTasksWithFilters } = useTaskStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [featuredProjectId, setFeaturedProjectId] = useState<string | null>(
    null
  );

  // Load featured project ID from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("featuredProjectId");
    if (saved) {
      setFeaturedProjectId(saved);
    }
  }, []);

  // Fetch projects and tasks on mount
  useEffect(() => {
    fetchProjects();
    fetchTasksWithFilters(undefined, undefined, null);
  }, [fetchProjects, fetchTasksWithFilters]);

  // Get featured project (selected or fallback to most recent)
  const featuredProject = featuredProjectId
    ? projects.find((p) => p.id === featuredProjectId)
    : projects.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];

  // Fetch project tasks when featured project changes
  useEffect(() => {
    if (featuredProject) {
      fetchProjectTasks(featuredProject.id);
    }
  }, [featuredProject, fetchProjectTasks]);

  // Calculate progress
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(
    (pt) => pt.task?.status === "Done"
  ).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Handle project selection
  const handleSelectProject = (projectId: string) => {
    setFeaturedProjectId(projectId);
    localStorage.setItem("featuredProjectId", projectId);
    setShowProjectSelector(false);
  };

  // Handle task click
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowTaskModal(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Idea: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      Planning: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Active: "bg-green-500/10 text-green-400 border-green-500/20",
      Debugging: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Testing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      OnHold: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Finished: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Abandoned: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };
    return colors[status] || colors["Idea"];
  };

  if (!featuredProject) {
    return (
      <div className="bg-card border-2 border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Featured Project</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          No projects yet. Create your first project!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">
                  Featured Project
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isExpanded && totalTasks > 0 && (
                <div className="px-2 py-1 bg-background rounded text-xs font-medium text-muted-foreground">
                  {completedTasks}/{totalTasks} ({progressPercentage}%)
                </div>
              )}
              <button
                onClick={() => setShowProjectSelector(true)}
                className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-primary"
                title="Select Featured Project"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {/* Title + Status */}
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-xl font-bold text-foreground">
                {featuredProject.title}
              </h4>
              <div
                className={`px-3 py-1 rounded border text-sm flex-shrink-0 ${getStatusColor(
                  featuredProject.status
                )}`}
              >
                {featuredProject.status}
              </div>
            </div>

            {/* Tech Stack */}
            {featuredProject.techStack &&
              featuredProject.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featuredProject.techStack.map((tech) => (
                    <div
                      key={tech.id}
                      className="bg-primary/10 border border-primary/20 rounded px-2 py-1"
                    >
                      <span className="text-xs text-foreground">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Description
              </label>
              <div className="bg-background border border-border rounded-lg px-3 py-2 max-h-24 overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {featuredProject.description || "No description"}
                </p>
              </div>
            </div>

            {/* Repository Link */}
            {featuredProject.repositoryUrl && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Repository
                </label>
                <a
                  href={featuredProject.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="truncate">
                    {featuredProject.repositoryUrl}
                  </span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Progress Stats */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Progress
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedTasks} / {totalTasks} tasks completed
                  </span>
                  <span className="text-foreground font-medium">
                    {progressPercentage}%
                  </span>
                </div>
                {totalTasks > 0 && (
                  <div className="w-full bg-background border border-border rounded-full h-2">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Tasks */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Assigned Tasks ({projectTasks.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {projectTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tasks assigned yet
                  </p>
                ) : (
                  projectTasks.map((pt) => (
                    <div
                      key={pt.id}
                      onClick={() => pt.task && handleTaskClick(pt.task.id)}
                      className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <h5
                        className={`text-sm font-medium mb-1 ${
                          pt.task?.status === "Done"
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {pt.task?.title}
                      </h5>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            pt.task?.priority === "High"
                              ? "bg-red-500/10 text-red-400"
                              : pt.task?.priority === "Medium"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {pt.task?.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-card text-muted-foreground">
                          {pt.task?.domain}
                        </span>
                        {pt.task?.deadline && (
                          <span className="px-2 py-0.5 rounded bg-card text-muted-foreground">
                            {new Date(pt.task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => (window.location.href = "/projects")}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                View Full Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Selector Modal */}
      {showProjectSelector && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowProjectSelector(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-card border border-border rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Select Featured Project
                </h3>
                <button
                  onClick={() => setShowProjectSelector(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-2">
                {projects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No projects available
                  </p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleSelectProject(project.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        featuredProjectId === project.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {project.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </span>
                            {project.tasks && project.tasks.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {
                                  project.tasks.filter(
                                    (t) => t.task?.status === "Done"
                                  ).length
                                }
                                /{project.tasks.length} tasks
                              </span>
                            )}
                          </div>
                        </div>
                        {featuredProjectId === project.id && (
                          <div className="text-primary">✓</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Task Detail Modal - Full Featured with Edit/Delete */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTaskId(null);
        }}
      />
    </>
  );
}
