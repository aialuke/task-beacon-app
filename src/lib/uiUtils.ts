
// src/lib/uiUtils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, TaskStatus } from "./types";
import { getDaysRemaining } from "./dateUtils";

/**
 * UI utility functions
 * 
 * This file contains utilities for UI-related operations such as:
 * - Class name merging and manipulation
 * - Element styling helpers
 * - UI state calculations
 * - Component-specific helpers
 */

// Function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Determine task status based on due date
export function getTaskStatus(task: Task): TaskStatus {
  if (task.status === "complete") {
    return "complete";
  }
  
  if (!task.due_date) {
    return "pending";
  }
  
  const daysRemaining = getDaysRemaining(task.due_date);
  if (daysRemaining < 0) {
    return "overdue";
  }
  return "pending";
}

// Get appropriate status color based on task status
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

// Get appropriate timer color based on task status
export function getTimerColor(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "var(--timer-complete)";
    case "overdue":
      return "var(--timer-overdue)";
    case "pending":
    default:
      return "var(--timer-pending)";
  }
}

// Get timer gradient based on status
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

// Get appropriate CSS classes for tooltip based on task status
export function getStatusTooltipClass(status: TaskStatus): string {
  if (status === "overdue") return "bg-destructive text-destructive-foreground";
  if (status === "complete") return "bg-success text-success-foreground";
  return "bg-gray-900 text-white";
}

// Get appropriate CSS classes for tooltip arrow based on task status
export function getTooltipArrowClass(status: TaskStatus): string {
  if (status === "overdue") return "fill-destructive";
  if (status === "complete") return "fill-success";
  return "fill-gray-900";
}

/**
 * Determines if an element is visible in the viewport
 * 
 * @param element - DOM element to check
 * @returns True if the element is visible in the viewport
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
 * 
 * @returns True if the device is in dark mode
 */
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

