import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isOverdue(deadline: string): boolean {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return deadlineDate < now;
}