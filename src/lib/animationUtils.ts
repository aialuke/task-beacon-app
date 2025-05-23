
// src/lib/animationUtils.ts
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

// Helper function to set up CSS variables for animations
export function setupAnimationVariables(
  element: HTMLElement | null, 
  options: { 
    circumference?: number;
    targetOffset?: number;
    duration?: string;
  }
) {
  if (!element) return;
  
  if (options.circumference !== undefined) {
    element.style.setProperty('--full-circumference', options.circumference.toString());
  }
  
  if (options.targetOffset !== undefined) {
    element.style.setProperty('--target-offset', options.targetOffset.toString());
  }
  
  if (options.duration) {
    element.style.setProperty('--animation-duration', options.duration);
  }
}

// Add missing import for TaskStatus
import { TaskStatus } from "./types";
