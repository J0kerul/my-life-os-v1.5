"use client";

import { useState, useEffect } from "react";
import { X, FolderPlus } from "lucide-react";
import { useProjectStore } from "@/lib/store/project-store";
import { useTechStackStore } from "@/lib/store/techstack-store";
import { useCategoryStore } from "@/lib/store/category-store";
import type { ProjectStatus, TechStackItem } from "@/types";

interface QuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function QuickAddDialog({ isOpen, onClose }: QuickAddDialogProps) {
  const { createProject } = useProjectStore();
  const { items: techStackItems, fetchItems } = useTechStackStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Idea");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [selectedTechStackIds, setSelectedTechStackIds] = useState<string[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      fetchCategories();
    }
  }, [isOpen, fetchItems, fetchCategories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject({
        title: title.trim(),
        description: description.trim(),
        status,
        repositoryUrl: repositoryUrl.trim() || undefined,
        techStackIds: selectedTechStackIds,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setStatus("Idea");
      setRepositoryUrl("");
      setSelectedTechStackIds([]);
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStatus("Idea");
    setRepositoryUrl("");
    setSelectedTechStackIds([]);
    onClose();
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

  // Group tech stack items by category
  const itemsByCategory = techStackItems.reduce((acc, item) => {
    const categoryName = item.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, TechStackItem[]>);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center gap-3">
              <FolderPlus className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                New Project
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project..."
                rows={4}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
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
            </div>

            {/* Repository URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Repository URL{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </label>
              <input
                type="url"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tech Stack{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </label>
              {techStackItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tech stack items available. Create some in Settings!
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto bg-background border border-border rounded-lg p-3">
                  {Object.entries(itemsByCategory).map(
                    ([categoryName, items]) => (
                      <div key={categoryName}>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                          {categoryName}
                        </h4>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-card/50 rounded px-2 py-1 transition-colors"
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
                    )
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
