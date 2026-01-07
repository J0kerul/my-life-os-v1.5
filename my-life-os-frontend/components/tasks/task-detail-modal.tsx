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
  Save
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

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ taskId, isOpen, onClose }: TaskDetailModalProps) {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  
  // Find task by ID
  const task = tasks.find(t => t.id === taskId);
  
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

  // Reset edit state when task changes
  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
      setEditPriority(task.priority);
      setEditDomain(task.domain);
      setEditDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      setIsEditing(false);
    }
  }, [task]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!task) return;
    
    setIsSaving(true);
    try {
      await updateTask(task.id, {
        title: editTitle,
        description: editDescription || undefined,
        priority: editPriority,
        domain: editDomain,
        deadline: editDeadline ? new Date(editDeadline).toISOString() : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    try {
      await deleteTask(task.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (!isOpen || !task) return null;

  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-card border-2 border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Task Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)] space-y-6">
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
                <h3 className={`text-xl font-semibold ${task.status === "Done" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
              )}
            </div>

            {/* Priority, Domain & Deadline - All Side by Side */}
            <div className="grid grid-cols-3 gap-4">
              {/* Priority */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block items-center gap-2">
                  <Flag className="w-3 h-3" />
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${priorityColor.bg}`}>
                    <span className={`text-lg ${priorityColor.text}`}>{priorityColor.icon}</span>
                    <span className={`text-sm font-medium ${priorityColor.text}`}>
                      {task.priority}
                    </span>
                  </div>
                )}
              </div>

              {/* Domain */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 blockitems-center gap-2">
                  <Tag className="w-3 h-3" />
                  Domain
                </label>
                {isEditing ? (
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
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {task.domain}
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Deadline
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                  />
                ) : task.deadline ? (
                  <div className="text-sm">
                    {format(new Date(task.deadline), "PPP", { locale: de })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No deadline</div>
                )}
              </div>
            </div>

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
              ) : task.description ? (
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No description</div>
              )}
            </div>

            {/* Created/Updated Info */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Created:</span>
                  <div className="mt-0.5">{format(new Date(task.createdAt), "PPp", { locale: de })}</div>
                </div>
                <div>
                  <span className="font-medium">Updated:</span>
                  <div className="mt-0.5">{format(new Date(task.updatedAt), "PPp", { locale: de })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="p-6 border-t border-border space-y-2">
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
      </div>
    </>
  );
}