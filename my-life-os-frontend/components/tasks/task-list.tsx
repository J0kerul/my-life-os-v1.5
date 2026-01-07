"use client";

import { useTaskStore } from "@/lib/store/task-store";
import { TaskItem } from "./task-item";

export function TaskList() {
  const { tasks, isLoading } = useTaskStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">No tasks yet</p>
        <p className="text-sm text-muted-foreground">
          Click &quot;+ New Task&quot; to create your first task
        </p>
      </div>
    );
  }

  // Count completed vs total
  const completedCount = tasks.filter((t) => t.status === "Done").length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-4">
      {/* Progress Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b border-border">
        <span>
          {completedCount} / {totalCount} completed
        </span>
        {totalCount > 0 && (
          <span>{Math.round((completedCount / totalCount) * 100)}%</span>
        )}
      </div>

      {/* Task Items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}