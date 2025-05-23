
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, TaskStatus } from "./types";
import { format, differenceInDays, differenceInHours } from "date-fns";

// Function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable format
export function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy");
}

// Format time to readable format
export function formatTime(dateString: string): string {
  return format(new Date(dateString), "h:mm a");
}

// Calculate days remaining until due date
export function getDaysRemaining(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  return differenceInDays(due, now);
}

// Calculate hours remaining until due date
export function getHoursRemaining(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  return differenceInHours(due, now);
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

// Function to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Function to truncate URL to domain or shortened form
export function truncateUrl(url: string, maxLength: number = 20): string {
  if (!url) return "";
  if (url.length <= maxLength) return url;

  try {
    const domain = new URL(url).hostname;
    if (domain.length <= maxLength) return domain;
    return `${domain.substring(0, maxLength - 1)}…`;
  } catch {
    return `${url.substring(0, maxLength - 1)}…`;
  }
}

// Function to truncate description with ellipsis at last space
export function truncateDescription(text: string, maxLength: number = 60): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}…` : `${truncated}…`;
}

// Function to compress and resize photos (placeholder for now)
export async function compressAndResizePhoto(file: File): Promise<File> {
  // This would be implemented with libwebp.js
  // For now, just return the original file
  return file;
}

// Function to get owner name from owner ID
export function getOwnerName(ownerId: string): string {
  // In a real app, this would fetch from a users table
  // For mock data, we'll use a simple mapping
  const mockUsernames: Record<string, string> = {
    "user-1": "Alex",
    "user-2": "Taylor",
    "user-3": "Jordan",
  };
  
  if (ownerId in mockUsernames) {
    return mockUsernames[ownerId];
  }
  
  // Extract first part of email-like IDs
  if (ownerId.includes("@")) {
    return ownerId.split("@")[0];
  }
  
  // Fallback: just return the first part of the ID
  const parts = ownerId.split("-");
  return parts.length > 1 ? parts[1] : ownerId;
}
