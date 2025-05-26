
/**
 * UI-specific utility functions
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, TaskStatus } from "./types";
import { getDaysRemaining } from "./dateUtils";

/**
 * Merges Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines task status based on due date and completion status
 */
export function getTaskStatus(task: Task): TaskStatus {
  if (task.status === "complete") {
    return "complete";
  }
  
  if (!task.due_date) {
    return "pending";
  }
  
  const daysRemaining = getDaysRemaining(task.due_date);
  if (daysRemaining !== null && daysRemaining < 0) {
    return "overdue";
  }
  return "pending";
}

/**
 * Gets appropriate status color class for task status
 */
export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "bg-success";
    case "overdue":
      return "bg-destructive";
    case "pending":
    default:
      return "bg-accent";
  }
}

/**
 * Gets appropriate timer color CSS variable for task status
 */
export function getTimerColor(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "var(--status-complete)";
    case "overdue":
      return "var(--status-overdue)";
    case "pending":
    default:
      return "var(--status-pending)";
  }
}

/**
 * Gets timer gradient based on status
 */
export function getTimerGradient(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "url(#gradientComplete)";
    case "overdue":
      return "url(#gradientOverdue)";
    case "pending":
    default:
      return "url(#gradientPending)";
  }
}

/**
 * Gets appropriate CSS classes for tooltip based on task status
 */
export function getStatusTooltipClass(status: TaskStatus): string {
  if (status === "overdue") return "bg-destructive text-destructive-foreground";
  if (status === "complete") return "bg-success text-success-foreground";
  return "bg-popover text-popover-foreground border border-border";
}

/**
 * Gets appropriate CSS classes for tooltip arrow based on task status
 */
export function getTooltipArrowClass(status: TaskStatus): string {
  if (status === "overdue") return "fill-destructive";
  if (status === "complete") return "fill-success";
  return "fill-popover";
}

/**
 * Determines if an element is visible in the viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Checks if the device is in dark mode
 */
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
