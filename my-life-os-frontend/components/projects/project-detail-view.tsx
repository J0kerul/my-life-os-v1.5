"use client";

import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { useProjectStore } from "@/lib/store/project-store";
import { useTechStackStore } from "@/lib/store/techstack-store";
import { useCategoryStore } from "@/lib/store/category-store";
import { useTaskStore } from "@/lib/store/task-store";
import type { ProjectStatus, TechStackItem } from "@/types";

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

export function ProjectDetailView() {
  const {
    selectedProject,
    projectTasks,
    updateProject,
    deleteProject,
    assignTask,
    unassignTask,
    fetchProjectTasks,
  } = useProjectStore();

  const { items: techStackItems, fetchItems: fetchTechStackItems } =
    useTechStackStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { tasks, fetchTasksWithFilters } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Idea");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [selectedTechStackIds, setSelectedTechStackIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    fetchTechStackItems();
    fetchCategories();
    fetchTasksWithFilters(undefined, undefined, null); // Fetch all tasks
  }, [fetchTechStackItems, fetchCategories, fetchTasksWithFilters]);

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject.title);
      setDescription(selectedProject.description);
      setStatus(selectedProject.status);
      setRepositoryUrl(selectedProject.repositoryUrl || "");
      setSelectedTechStackIds(
        selectedProject.techStack?.map((t) => t.id) || []
      );
      fetchProjectTasks(selectedProject.id);
    }
  }, [selectedProject, fetchProjectTasks]);

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">
            No project selected
          </p>
          <p className="text-sm text-muted-foreground">
            Select a project from the list to view details
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateProject(selectedProject.id, {
        title,
        description,
        status,
        repositoryUrl,
        techStackIds: selectedTechStackIds,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(selectedProject.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    }
  };

  const handleTechStackToggle = (techStackId: string) => {
    if (selectedTechStackIds.includes(techStackId)) {
      setSelectedTechStackIds(
        selectedTechStackIds.filter((id) => id !== techStackId)
      );
    } else {
      setSelectedTechStackIds([...selectedTechStackIds, techStackId]);
    }
  };

  const handleAssignTask = async (taskId: string) => {
    try {
      await assignTask(selectedProject.id, { taskId });
      setShowAddTaskDialog(false);
    } catch (error) {
      console.error("Failed to assign task:", error);
      alert("Failed to assign task");
    }
  };

  const handleUnassignTask = async (taskId: string) => {
    try {
      await unassignTask(selectedProject.id, taskId);
    } catch (error) {
      console.error("Failed to unassign task:", error);
      alert("Failed to unassign task");
    }
  };

  // Group tech stack items by category for display
  const itemsByCategory = techStackItems.reduce((acc, item) => {
    const categoryName = item.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, TechStackItem[]>);

  // Filter out already assigned tasks
  const assignedTaskIds = projectTasks.map((pt) => pt.taskId);
  const availableTasks = tasks.filter(
    (task) => !assignedTaskIds.includes(task.id)
  );

  // Calculate progress
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(
    (pt) => pt.task?.status === "Done"
  ).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Edit/Delete buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Project Details</h2>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Title
        </label>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ) : (
          <p className="text-lg font-semibold text-foreground">
            {selectedProject.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Description
        </label>
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        ) : (
          <div className="max-h-32 overflow-y-auto bg-background border border-border rounded-lg px-3 py-2">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {selectedProject.description || "No description"}
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Status
        </label>
        {isEditing ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-foreground">{selectedProject.status}</p>
        )}
      </div>

      {/* Repository URL */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Repository URL
        </label>
        {isEditing ? (
          <input
            type="url"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ) : selectedProject.repositoryUrl ? (
          <a
            href={selectedProject.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm truncate">
              {selectedProject.repositoryUrl}
            </span>
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">No repository URL</p>
        )}
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Tech Stack
        </label>
        {isEditing ? (
          <div className="space-y-3 max-h-48 overflow-y-auto bg-background border border-border rounded-lg p-3">
            {Object.entries(itemsByCategory).map(([categoryName, items]) => (
              <div key={categoryName}>
                <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                  {categoryName}
                </h4>
                <div className="space-y-1">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTechStackIds.includes(item.id)}
                        onChange={() => handleTechStackToggle(item.id)}
                        className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm text-foreground">
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedProject.techStack &&
            selectedProject.techStack.length > 0 ? (
              selectedProject.techStack.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-primary/10 border border-primary/20 rounded px-3 py-1"
                >
                  <span className="text-sm text-foreground">{tech.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No tech stack selected
              </p>
            )}
          </div>
        )}
      </div>

      {/* Progress Stats (only in view mode) */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
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
      )}

      {/* Assigned Tasks (only in view mode) */}
      {!isEditing && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-muted-foreground">
              Assigned Tasks ({projectTasks.length})
            </label>
            <button
              onClick={() => setShowAddTaskDialog(true)}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projectTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks assigned yet
              </p>
            ) : (
              projectTasks.map((pt) => (
                <div
                  key={pt.id}
                  className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-medium mb-1 ${
                          pt.task?.status === "Done"
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {pt.task?.title}
                      </h4>
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
                        <span className="px-2 py-0.5 rounded bg-background text-muted-foreground">
                          {pt.task?.domain}
                        </span>
                        {pt.task?.deadline && (
                          <span className="px-2 py-0.5 rounded bg-background text-muted-foreground">
                            {new Date(pt.task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnassignTask(pt.taskId)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Mode Actions */}
      {isEditing && (
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              // Reset form to original values
              setTitle(selectedProject.title);
              setDescription(selectedProject.description);
              setStatus(selectedProject.status);
              setRepositoryUrl(selectedProject.repositoryUrl || "");
              setSelectedTechStackIds(
                selectedProject.techStack?.map((t) => t.id) || []
              );
            }}
            className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground rounded-lg px-4 py-2 hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Delete Project
              </h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete "{selectedProject.title}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Task Dialog */}
      {showAddTaskDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowAddTaskDialog(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Add Task to Project
                </h3>
                <button
                  onClick={() => setShowAddTaskDialog(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {availableTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No available tasks to assign
                  </p>
                ) : (
                  availableTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleAssignTask(task.id)}
                      className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {task.title}
                      </h4>
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
                        <span
                          className={`px-2 py-0.5 rounded ${
                            task.status === "Done"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-background text-muted-foreground"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
