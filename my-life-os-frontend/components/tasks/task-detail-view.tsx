"use client";

import { useTaskStore } from "@/lib/store/task-store";
import { useState, useEffect } from "react";
import type { TaskPriority, TaskDomain } from "@/types";
import {
  Calendar,
  Tag,
  Flag,
  Trash2,
  X,
  ClipboardList,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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

const PRIORITY_COLORS = {
  Low: { text: "text-green-500", bg: "bg-green-500/10", icon: "↓" },
  Medium: { text: "text-yellow-500", bg: "bg-yellow-500/10", icon: "−" },
  High: { text: "text-red-500", bg: "bg-red-500/10", icon: "↑" },
};

export function TaskDetailView() {
  const { selectedTask, updateTask, deleteTask, selectTask } = useTaskStore();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("Medium");
  const [editDomain, setEditDomain] = useState<TaskDomain>("Work");
  const [editDeadline, setEditDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset edit state when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setEditTitle(selectedTask.title);
      setEditDescription(selectedTask.description || "");
      setEditPriority(selectedTask.priority);
      setEditDomain(selectedTask.domain);
      setEditDeadline(
        selectedTask.deadline ? selectedTask.deadline.split("T")[0] : ""
      );
      setIsEditing(false);
    }
  }, [selectedTask]);

  const handleSave = async () => {
    if (!selectedTask) return;

    setIsSaving(true);
    try {
      await updateTask(selectedTask.id, {
        title: editTitle,
        description: editDescription || undefined,
        priority: editPriority,
        domain: editDomain,
        deadline: editDeadline
          ? new Date(editDeadline).toISOString()
          : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask(selectedTask.id);
      setShowDeleteConfirm(false);
      selectTask(null); // Deselect after delete
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (!selectedTask) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ClipboardList className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No task selected
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a task to view details
        </p>
      </div>
    );
  }

  const priorityColor = PRIORITY_COLORS[selectedTask.priority];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center relative">
        <h2 className="text-lg font-bold">Task Details</h2>
        <button
          onClick={() => selectTask(null)}
          className="absolute right-0 p-1 hover:bg-accent rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <h3
              className={`text-xl font-semibold ${
                selectedTask.status === "Done"
                  ? "line-through text-muted-foreground"
                  : ""
              }`}
            >
              {selectedTask.title}
            </h3>
          )}
        </div>

        {/* Priority, Domain & Deadline - 3 Columns with Icons (View Mode) */}
        {!isEditing ? (
          <div className="grid grid-cols-3 gap-4">
            {/* Priority */}
            <div className="text-center">
              <div
                className={`flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full ${priorityColor.bg}`}
              >
                <span className={`text-2xl ${priorityColor.text}`}>
                  {priorityColor.icon}
                </span>
              </div>
              <div className={`text-sm font-medium ${priorityColor.text}`}>
                {selectedTask.priority}
              </div>
            </div>

            {/* Domain */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10">
                <Tag className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-primary">
                {selectedTask.domain}
              </div>
            </div>

            {/* Deadline */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-muted">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">
                {selectedTask.deadline
                  ? format(new Date(selectedTask.deadline), "d. MMM", {
                      locale: de,
                    })
                  : "No deadline"}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode - Priority & Domain Side by Side */
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value as TaskPriority)
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Domain */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Domain
              </label>
              <select
                value={editDomain}
                onChange={(e) => setEditDomain(e.target.value as TaskDomain)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Deadline - Only in Edit Mode */}
        {isEditing && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Deadline
            </label>
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description..."
              rows={6}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          ) : selectedTask.description ? (
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selectedTask.description}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No description
            </div>
          )}
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="pt-4 border-t border-border space-y-2">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !editTitle.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Task
          </button>
        )}

        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
        ) : (
          <div className="space-y-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-500 font-medium">
              Are you sure you want to delete this task?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
