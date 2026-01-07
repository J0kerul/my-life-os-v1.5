"use client";

import { ArrowUp, Minus, ArrowDown } from "lucide-react";
import { useTaskStore } from "@/lib/store/task-store";
import type { Task } from "@/types";
import { formatDeadline, isOverdue } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskStatus, selectTask, selectedTask } = useTaskStore();

  const isSelected = selectedTask?.id === task.id;
  const taskIsOverdue = task.deadline && isOverdue(task.deadline) && task.status === "Todo";
  const deadlineInfo = task.deadline ? formatDeadline(task.deadline) : null;

  // Priority colors and icons
  const getPriorityStyles = () => {
    switch (task.priority) {
      case "High":
        return {
          color: "text-red-500",
          bg: "bg-red-500/10",
          icon: <ArrowUp className="w-4 h-4" />,
        };
      case "Medium":
        return {
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          icon: <Minus className="w-4 h-4" />,
        };
      case "Low":
        return {
          color: "text-green-500",
          bg: "bg-green-500/10",
          icon: <ArrowDown className="w-4 h-4" />,
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting task
    await toggleTaskStatus(task.id);
  };

  return (
    <div
      onClick={() => selectTask(task)}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
        isSelected
          ? "bg-primary/10 border-primary"
          : "bg-card border-border hover:bg-accent"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          task.status === "Done"
            ? "bg-primary border-primary"
            : "border-muted-foreground hover:border-primary"
        }`}
      >
        {task.status === "Done" && (
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Priority Icon */}
      <div className={`p-1 rounded ${priorityStyles.bg} ${priorityStyles.color}`}>
        {priorityStyles.icon}
      </div>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <h3
          className={`font-medium truncate ${
            task.status === "Done" ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span>{task.domain}</span>
          {deadlineInfo && (
            <>
              <span>•</span>
              <span className={deadlineInfo.isRed ? "text-red-500 font-medium" : ""}>
                {deadlineInfo.text}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Overdue Indicator */}
      {taskIsOverdue && deadlineInfo?.showOverdue && (
        <div className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs font-medium rounded">
          Overdue
        </div>
      )}
    </div>
  );
}