
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, TaskStatus } from "./types";
import { format, differenceInDays } from "date-fns";

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

// Determine task status based on due date
export function getTaskStatus(task: Task): TaskStatus {
  if (task.status === "complete") {
    return "complete";
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
    case "overdue":
      return "#DA3E52"; // Destructive red
    case "pending":
    default:
      return "#3662E3"; // Primary blue
  }
}

// Function to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
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
    'user-1': 'Alex',
    'user-2': 'Taylor',
    'user-3': 'Jordan',
  };
  
  if (ownerId in mockUsernames) {
    return mockUsernames[ownerId];
  }
  
  // Extract first part of email-like IDs
  if (ownerId.includes('@')) {
    return ownerId.split('@')[0];
  }
  
  // Fallback: just return the first part of the ID
  const parts = ownerId.split('-');
  return parts.length > 1 ? parts[1] : ownerId;
}
