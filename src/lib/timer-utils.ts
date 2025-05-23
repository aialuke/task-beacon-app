
import { TaskStatus } from "./types";

// Calculate the offset for the timer ring based on days left and status
export const calculateTimerOffset = (
  circumference: number,
  daysLeft: number,
  status: TaskStatus,
  dueDate: string | null
): number => {
  if (status === "complete") return 0;
  if (status === "overdue") return 0;
  if (!dueDate) return circumference; // No due date, empty ring
  
  const totalDays = 14;
  const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  return circumference * (1 - remainingPercentage);
};

// Validate and calculate days remaining until due date
export const validateDueDate = (date: string | null): number => {
  if (!date) return 0;
  const due = new Date(date).getTime();
  if (isNaN(due)) return 0;
  const now = Date.now();
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
};

// Format the time display based on days left and status
export const formatTimeDisplay = (days: number, dueDate: string | null, status: TaskStatus): string => {
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
};

// Generate tooltip content for timer
export const getTooltipContent = (dueDate: string | null): string => {
  if (!dueDate) return "No due date";
  if (isNaN(new Date(dueDate).getTime())) return "Invalid due date";
  
  const dueTimeStr = new Date(dueDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `Due: ${new Date(dueDate).toLocaleDateString()} at ${dueTimeStr}`;
};

// Get appropriate CSS classes for tooltip based on task status
export const getStatusTooltipClass = (status: TaskStatus): string => {
  if (status === "overdue") return "bg-destructive text-destructive-foreground";
  if (status === "complete") return "bg-success text-success-foreground";
  return "bg-gray-900 text-white";
};

// Get appropriate CSS classes for tooltip arrow based on task status
export const getTooltipArrowClass = (status: TaskStatus): string => {
  if (status === "overdue") return "fill-destructive";
  if (status === "complete") return "fill-success";
  return "fill-gray-900";
};
