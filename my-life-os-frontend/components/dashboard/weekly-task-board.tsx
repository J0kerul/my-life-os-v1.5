"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/lib/store/task-store";
import type { TimeFilter } from "@/types";
import { ChevronDown, ChevronUp, ClipboardCheck, Plus } from "lucide-react";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { QuickAddDialog } from "@/components/tasks/quick-add-dialog";
import { formatDeadline, isOverdue } from "@/lib/utils";

const TIME_FILTERS: { value: TimeFilter | null; label: string }[] = [
  { value: null, label: "All Tasks" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "next_week", label: "Next Week" },
  { value: "next_month", label: "Next Month" },
  { value: "long_term", label: "Long Term" },
];

interface WeeklyTaskBoardProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function WeeklyTaskBoard({
  isExpanded,
  onToggleExpand,
}: WeeklyTaskBoardProps) {
  const { tasks, fetchTasksWithFilters, toggleTaskStatus } = useTaskStore();

  // Widget state
  const [timeFilter, setTimeFilter] = useState<TimeFilter | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks on mount and when filter changes (only Todo tasks)
  useEffect(() => {
    fetchTasksWithFilters(undefined, "Todo", timeFilter);
  }, [timeFilter, fetchTasksWithFilters]);

  // Filter to only show Todo tasks
  const todoTasks = tasks.filter((task) => task.status === "Todo");

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    await toggleTaskStatus(taskId);
  };

  const completedCount = tasks.filter((t) => t.status === "Done").length;
  const totalCount = tasks.length;

  return (
    <>
      {/* Widget Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Icon - Colored */}
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-blue-500" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-200">
              Task Manager
            </h2>

            {/* Badge - Task count */}
            {!isExpanded && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                {todoTasks.length}
              </span>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Add Button */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Add Task"
            >
              <Plus className="w-5 h-5 text-gray-400" />
            </button>

            {/* Expand/Collapse Button */}
            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 space-y-4 h-[380px] flex flex-col">
            {/* Time Filter */}
            <div className="flex flex-wrap gap-2">
              {TIME_FILTERS.map((filter) => (
                <button
                  key={filter.value || "all"}
                  onClick={() => setTimeFilter(filter.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    timeFilter === filter.value
                      ? "bg-blue-500 text-white"
                      : "bg-background border border-border text-gray-400 hover:bg-accent"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{todoTasks.length} tasks to do</span>
              {totalCount > 0 && (
                <span>
                  {completedCount}/{totalCount} completed
                </span>
              )}
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {todoTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No tasks to do! 🎉</p>
                  <p className="text-xs mt-1">Click + to add a new task</p>
                </div>
              ) : (
                todoTasks.map((task) => {
                  const deadlineInfo = task.deadline
                    ? formatDeadline(task.deadline)
                    : null;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => handleToggleStatus(task.id, e)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        <div className="w-5 h-5 border-2 border-border rounded hover:border-primary transition-colors" />
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-200 group-hover:text-primary transition-colors">
                          {task.title}
                        </h3>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {/* Priority */}
                          <span
                            className={`${
                              task.priority === "High"
                                ? "text-red-500"
                                : task.priority === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {task.priority === "High"
                              ? "↑"
                              : task.priority === "Medium"
                              ? "−"
                              : "↓"}
                          </span>

                          {/* Domain */}
                          <span>{task.domain}</span>

                          {/* Deadline */}
                          {deadlineInfo && (
                            <>
                              <span>•</span>
                              <span
                                className={
                                  deadlineInfo.isRed
                                    ? "text-red-500 font-medium"
                                    : ""
                                }
                              >
                                {deadlineInfo.text}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Overdue badge */}
                      {deadlineInfo?.showOverdue && (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded-full flex-shrink-0">
                          Overdue
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTaskId(null);
        }}
      />

      {/* Quick Add Dialog */}
      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
}
