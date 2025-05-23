
// src/lib/dateUtils.ts
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { TaskStatus } from "./types";

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

// Get tooltip content for timer
export function getTooltipContent(dueDate: string | null): string {
  if (!dueDate) return "No due date";
  if (isNaN(new Date(dueDate).getTime())) return "Invalid due date";
  
  const dueTimeStr = new Date(dueDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `Due: ${new Date(dueDate).toLocaleDateString()} at ${dueTimeStr}`;
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
