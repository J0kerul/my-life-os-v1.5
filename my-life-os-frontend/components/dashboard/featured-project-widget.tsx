"use client";

import { useState, useEffect } from "react";
import {
  FolderKanban,
  ChevronDown,
  Settings,
  ExternalLink,
  X,
  Plus,
  FolderPlus,
  ListPlus,
  Link2,
} from "lucide-react";
import { useProjectStore } from "@/lib/store/project-store";
import { useTaskStore } from "@/lib/store/task-store";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import type { Task, TaskPriority, TaskDomain, ProjectStatus } from "@/types";

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

  // Quick Add states
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false);

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
                onClick={() => setShowQuickAddMenu(true)}
                className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-primary"
                title="Quick Add"
              >
                <Plus className="w-4 h-4" />
              </button>
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

      {/* Quick Add Action Menu */}
      {showQuickAddMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowQuickAddMenu(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-card border border-border rounded-lg w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Quick Add
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setShowQuickAddMenu(false);
                    setShowNewProjectDialog(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FolderPlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      New Project
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Create a new project
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowQuickAddMenu(false);
                    setShowNewTaskDialog(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <ListPlus className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">New Task</div>
                    <div className="text-xs text-muted-foreground">
                      Create a completely new task
                    </div>
                  </div>
                </button>

                {featuredProject && (
                  <button
                    onClick={() => {
                      setShowQuickAddMenu(false);
                      setShowAssignTaskDialog(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        Assign Existing Task
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Add a task to this project
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Project Dialog */}
      {showNewProjectDialog && (
        <NewProjectDialog
          isOpen={showNewProjectDialog}
          onClose={() => setShowNewProjectDialog(false)}
        />
      )}

      {/* New Task Dialog */}
      {showNewTaskDialog && (
        <NewTaskDialog
          isOpen={showNewTaskDialog}
          onClose={() => setShowNewTaskDialog(false)}
        />
      )}

      {/* Assign Existing Task Dialog */}
      {showAssignTaskDialog && featuredProject && (
        <AssignTaskDialog
          isOpen={showAssignTaskDialog}
          onClose={() => setShowAssignTaskDialog(false)}
          projectId={featuredProject.id}
        />
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

// New Project Dialog Component
function NewProjectDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createProject, fetchProjects } = useProjectStore();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Idea");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [selectedTechStackIds, setSelectedTechStackIds] = useState<string[]>(
    []
  );
  const [techStackItems, setTechStackItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const STATUS_OPTIONS: ProjectStatus[] = [
    "Idea",
    "Planning",
    "Active",
    "Debugging",
    "Testing",
    "OnHold",
    "Finished",
    "Abandoned",
  ];

  // Fetch tech stack items and categories on mount
  useEffect(() => {
    if (isOpen) {
      fetchTechStackData();
    }
  }, [isOpen]);

  const fetchTechStackData = async () => {
    try {
      // Fetch categories
      const categoriesRes = await fetch("/api/categories", {
        credentials: "include",
      });
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }

      // Fetch tech stack items
      const itemsRes = await fetch("/api/tech-stack", {
        credentials: "include",
      });
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setTechStackItems(itemsData.techStackItems || []);
      }
    } catch (error) {
      console.error("Failed to fetch tech stack data:", error);
    }
  };

  // Group tech stack items by category
  const groupedTechStack = categories.map((category) => ({
    category,
    items: techStackItems.filter((item) => item.categoryId === category.id),
  }));

  const toggleTechStack = (id: string) => {
    setSelectedTechStackIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return;

    setIsCreating(true);
    try {
      await createProject({
        title: title.trim(),
        description: description.trim(),
        status,
        repositoryUrl: repositoryUrl.trim() || undefined,
        techStackIds: selectedTechStackIds,
      });
      await fetchProjects();
      setTitle("");
      setDescription("");
      setStatus("Idea");
      setRepositoryUrl("");
      setSelectedTechStackIds([]);
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              New Project
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project title..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Repository URL
                </label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tech Stack
              </label>
              <div className="space-y-3 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                {groupedTechStack.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tech stack items available. Add them in Settings.
                  </p>
                ) : (
                  groupedTechStack.map(({ category, items }) => (
                    <div key={category.id}>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                        {category.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item: any) => (
                          <button
                            key={item.id}
                            onClick={() => toggleTechStack(item.id)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              selectedTechStackIds.includes(item.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border border-border hover:border-primary/50"
                            }`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={isCreating || !title.trim() || !description.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// New Task Dialog Component
function NewTaskDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createTask, fetchTasksWithFilters } = useTaskStore();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [domain, setDomain] = useState<TaskDomain>("Work");
  const [deadline, setDeadline] = useState("");

  const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];
  const DOMAINS: TaskDomain[] = [
    "Work",
    "University",
    "Coding Project",
    "Personal Project",
    "Goals",
    "Finances",
    "Household",
    "Health",
  ];

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      await createTask({
        title: title.trim(),
        priority,
        domain,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        description: description.trim() || undefined,
      });
      await fetchTasksWithFilters(undefined, undefined, null);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDomain("Work");
      setDeadline("");
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">New Task</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as TaskDomain)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={isCreating || !title.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Assign Existing Task Dialog Component
function AssignTaskDialog({
  isOpen,
  onClose,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}) {
  const { tasks, fetchTasksWithFilters } = useTaskStore();
  const { assignTask, fetchProjectTasks, projectTasks } = useProjectStore();
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTasksWithFilters(undefined, undefined, null);
    }
  }, [isOpen, fetchTasksWithFilters]);

  // Filter out already assigned tasks
  const assignedTaskIds = new Set(
    projectTasks.map((pt) => pt.task?.id).filter(Boolean)
  );
  const availableTasks = tasks.filter((task) => !assignedTaskIds.has(task.id));

  // Filter by search query
  const filteredTasks = availableTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignTask = async (taskId: string) => {
    setIsAssigning(true);
    try {
      await assignTask(projectId, { taskId });
      await fetchProjectTasks(projectId);
      onClose();
    } catch (error) {
      console.error("Failed to assign task:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Assign Existing Task
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 border-b border-border">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="overflow-y-auto p-4 space-y-2 flex-1">
            {filteredTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery
                  ? "No tasks found"
                  : "No available tasks to assign"}
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleAssignTask(task.id)}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <h5 className="text-sm font-medium text-foreground mb-1">
                    {task.title}
                  </h5>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        task.priority === "High"
                          ? "bg-red-500/10 text-red-400"
                          : task.priority === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-card text-muted-foreground">
                      {task.domain}
                    </span>
                    {task.deadline && (
                      <span className="px-2 py-0.5 rounded bg-card text-muted-foreground">
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
