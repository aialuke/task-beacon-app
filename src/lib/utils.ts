
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, TaskStatus } from "./types";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

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
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  return differenceInDays(due, now);
}

// Calculate hours remaining until due date
export function getHoursRemaining(dueDate: string): number {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  return differenceInHours(due, now);
}

// Calculate minutes remaining until due date
export function getMinutesRemaining(dueDate: string): number {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  return differenceInMinutes(due, now);
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

// Calculate the offset for the timer ring based on days left and status
export function calculateTimerOffset(
  circumference: number,
  daysLeft: number,
  status: TaskStatus,
  dueDate: string | null
): number {
  if (status === "complete") return 0;
  if (status === "overdue") return 0;
  if (!dueDate) return circumference; // No due date, empty ring
  
  const totalDays = 14;
  const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  return circumference * (1 - remainingPercentage);
}

// Format the time display based on days left and status
export function formatTimeDisplay(days: number, dueDate: string | null, status: TaskStatus): string {
  if (!dueDate) return "No due date";
  
  if (status === "overdue") {
    // For overdue tasks, show negative days (e.g., "-1d")
    return `-${Math.abs(days)}d`;
  } 
  
  // Check if the task is due today
  const dueTime = new Date(dueDate).getTime();
  const now = Date.now();
  const hoursLeft = Math.floor((dueTime - now) / (1000 * 60 * 60));
  
  // If less than 24 hours remaining, show hours
  if (days === 0 || hoursLeft < 24) {
    return `${Math.max(hoursLeft, 0)}h`;
  } else {
    // Normal case - show days
    return `${days}d`;
  }
}

// Generate tooltip content for timer
export function getTooltipContent(dueDate: string | null): string {
  if (!dueDate) return "No due date";
  if (isNaN(new Date(dueDate).getTime())) return "Invalid due date";
  
  const dueTimeStr = new Date(dueDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `Due: ${new Date(dueDate).toLocaleDateString()} at ${dueTimeStr}`;
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

// Function to truncate text with ellipsis (unified function)
export function truncateText(text: string, maxLength: number = 100, useLastSpace: boolean = false): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  if (useLastSpace) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}…` : `${truncated}…`;
  } else {
    return `${text.substring(0, maxLength)}...`;
  }
}

// Specialized truncate for descriptions using truncateText with last space
export function truncateDescription(text: string, maxLength: number = 60): string {
  return truncateText(text, maxLength, true);
}

// Specialized truncate for URLs
export function truncateUrl(url: string, maxLength: number = 20): string {
  if (!url) return "";
  if (url.length <= maxLength) return url;

  try {
    const domain = new URL(url).hostname;
    if (domain.length <= maxLength) return domain;
    return truncateText(domain, maxLength - 1, false);
  } catch {
    return truncateText(url, maxLength - 1, false);
  }
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

// Determine update frequency based on time remaining
export function getUpdateInterval(daysLeft: number, status: TaskStatus): number {
  if (status === "complete") return 0; // No updates needed
  
  if (status === "overdue") return 30000; // 30 seconds for overdue tasks
  
  if (daysLeft <= 0) {
    const hoursLeft = Math.ceil(getHoursRemaining(new Date().toISOString()));
    
    if (hoursLeft <= 1) return 1000; // Every second if less than 1 hour
    if (hoursLeft <= 24) return 30000; // 30 seconds if less than 24 hours
  }
  
  return 3600000; // Every hour for tasks due in days
}
