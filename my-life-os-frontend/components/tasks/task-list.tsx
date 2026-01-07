"use client";

import { useTaskStore } from "@/lib/store/task-store";
import { TaskItem } from "./task-item";

export function TaskList() {
  const { tasks, isLoading, timeFilter } = useTaskStore();

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

  // If showing all tasks, group by deadline
  const showGrouping = timeFilter === null;
  const tasksWithDeadline = showGrouping ? tasks.filter((t) => t.deadline) : [];
  const tasksLongTerm = showGrouping ? tasks.filter((t) => !t.deadline) : [];

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

      {/* Task Items - Grouped or Flat */}
      {showGrouping ? (
        <>
          {/* Tasks with Deadline */}
          {tasksWithDeadline.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ⏰ Time Sensitive Tasks ({tasksWithDeadline.length})
              </h3>
              <div className="space-y-2">
                {tasksWithDeadline.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Long Term Tasks */}
          {tasksLongTerm.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                📋 Long Term ({tasksLongTerm.length})
              </h3>
              <div className="space-y-2">
                {tasksLongTerm.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        // Flat list when time filter is active
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}