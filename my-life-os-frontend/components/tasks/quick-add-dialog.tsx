"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTaskStore } from "@/lib/store/task-store";
import type { TaskPriority, TaskDomain } from "@/types";

interface QuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

export function QuickAddDialog({ isOpen, onClose }: QuickAddDialogProps) {
  const { createTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<TaskDomain>("Work");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Convert date to ISO 8601 format if provided
      let isoDeadline: string | null = null;
      if (deadline) {
        const date = new Date(deadline);
        isoDeadline = date.toISOString();
      }

      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        domain,
        deadline: isoDeadline,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("Medium");
      setDomain("Work");
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-muted-foreground/20 rounded-lg p-6 z-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">New Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task title..."
              autoFocus
            />
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-2">
              Domain *
            </label>
            <div className="relative">
              <select
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value as TaskDomain)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-background text-foreground">
                    {d}
                  </option>
                ))}
              </select>
              {/* Custom Arrow */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-2">
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="bg-background text-foreground">
                    {p}
                  </option>
                ))}
              </select>
              {/* Custom Arrow */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium mb-2">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark] cursor-pointer"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}