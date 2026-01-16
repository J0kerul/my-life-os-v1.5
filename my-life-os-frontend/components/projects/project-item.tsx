"use client";

import {
  Lightbulb,
  Clipboard,
  Zap,
  Bug,
  TestTube2,
  Pause,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Project, ProjectStatus } from "@/types";

interface ProjectItemProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  { icon: any; color: string; label: string }
> = {
  Idea: {
    icon: Lightbulb,
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    label: "Idea",
  },
  Planning: {
    icon: Clipboard,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    label: "Planning",
  },
  Active: {
    icon: Zap,
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    label: "Active",
  },
  Debugging: {
    icon: Bug,
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    label: "Debugging",
  },
  Testing: {
    icon: TestTube2,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    label: "Testing",
  },
  OnHold: {
    icon: Pause,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    label: "On Hold",
  },
  Finished: {
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Finished",
  },
  Abandoned: {
    icon: XCircle,
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    label: "Abandoned",
  },
};

export function ProjectItem({
  project,
  isSelected,
  onClick,
}: ProjectItemProps) {
  const statusConfig = STATUS_CONFIG[project.status];
  const StatusIcon = statusConfig.icon;

  // Calculate progress
  const totalTasks = project.tasks?.length || 0;
  const completedTasks =
    project.tasks?.filter((pt) => pt.task?.status === "Done").length || 0;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tech stack display (show max 4, then "+X more")
  const maxTechStackDisplay = 4;
  const displayedTechStack =
    project.techStack?.slice(0, maxTechStackDisplay) || [];
  const remainingTechStack = Math.max(
    0,
    (project.techStack?.length || 0) - maxTechStackDisplay
  );

  return (
    <div
      onClick={onClick}
      className={`bg-card border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
        isSelected
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-border"
      }`}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-1">
        {project.title}
      </h3>

      {/* Status Badge */}
      <div className="mb-3">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border ${statusConfig.color}`}
        >
          <StatusIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{statusConfig.label}</span>
        </div>
      </div>

      {/* Tech Stack Badges */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {displayedTechStack.map((tech) => (
              <div
                key={tech.id}
                className="bg-background border border-border rounded px-2 py-1"
              >
                <span className="text-xs text-muted-foreground">
                  {tech.name}
                </span>
              </div>
            ))}
            {remainingTechStack > 0 && (
              <div className="bg-background border border-border rounded px-2 py-1">
                <span className="text-xs text-muted-foreground">
                  +{remainingTechStack} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Badge */}
      {totalTasks > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-background border border-border rounded-full h-2">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {completedTasks}/{totalTasks}
          </span>
        </div>
      )}
    </div>
  );
}
