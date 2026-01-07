import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isOverdue(deadline: string): boolean {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  // Set both to start of day for comparison
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineStart = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  
  // Only overdue if deadline is BEFORE today (not including today)
  return deadlineStart < todayStart;
}

export function formatDeadline(deadline: string): { text: string; isRed: boolean; showOverdue: boolean } {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  // Set both to start of day for comparison
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineStart = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  
  const diffTime = deadlineStart.getTime() - todayStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - red text, no overdue badge
    return { text: "heute", isRed: true, showOverdue: false };
  } else if (diffDays === -1) {
    // Yesterday - show "gestern" + overdue badge
    return { text: "gestern", isRed: true, showOverdue: true };
  } else if (diffDays < -1) {
    // Before yesterday - show date + overdue badge
    const dateText = deadlineDate.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short"
    });
    return { text: dateText, isRed: true, showOverdue: true };
  } else {
    // Future - normal date, no red, no overdue
    const dateText = deadlineDate.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short"
    });
    return { text: dateText, isRed: false, showOverdue: false };
  }
}