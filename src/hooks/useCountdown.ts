
import { useState, useEffect, useRef, useMemo } from "react";
import { TaskStatus } from "@/lib/types";
import { 
  getDaysRemaining,
  formatTimeDisplay,
  getUpdateInterval
} from "@/lib/dateUtils";
import { calculateTimerOffset } from "@/lib/animationUtils";

/**
 * Custom hook for countdown timer functionality
 * 
 * Manages the timer state, calculations, and update intervals for task countdown displays
 * 
 * @param dueDate - The due date of the task as an ISO string
 * @param status - The current status of the task
 * @param circumference - The circumference of the timer ring for offset calculations
 * @returns The calculated timer state values
 */
export function useCountdown(dueDate: string | null, status: TaskStatus, circumference: number) {
  // Memoize the initial days left calculation to avoid unnecessary recalculations
  const initialDaysLeft = useMemo(() => 
    dueDate ? getDaysRemaining(dueDate) : 0
  , [dueDate]);
  
  const [daysLeft, setDaysLeft] = useState<number>(initialDaysLeft);
  
  // Memoize the time display calculation
  const initialTimeDisplay = useMemo(() => 
    dueDate ? formatTimeDisplay(initialDaysLeft, dueDate, status) : "No due date"
  , [dueDate, initialDaysLeft, status]);
  
  const [timeDisplay, setTimeDisplay] = useState<string>(initialTimeDisplay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize tooltip content to avoid recalculation
  const tooltipContent = useMemo(() => {
    if (!dueDate) return "No due date set";
    
    const daysRemaining = getDaysRemaining(dueDate);
    const date = new Date(dueDate);
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (status === "complete") {
      return `Completed (was due on ${formattedDate})`;
    } else if (daysRemaining < 0) {
      return `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} (${formattedDate})`;
    } else if (daysRemaining === 0) {
      return `Due today (${formattedDate})`;
    } else {
      return `Due in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} (${formattedDate})`;
    }
  }, [dueDate, status]);

  // Memoize stroke dash offset calculation
  const dashOffset = useMemo(() => 
    calculateTimerOffset(circumference, daysLeft, status, dueDate), 
    [circumference, daysLeft, status, dueDate]
  );

  // Memoize the update interval calculation
  const updateInterval = useMemo(() => 
    getUpdateInterval(daysLeft, status),
    [daysLeft, status]
  );

  // Memoize the update function to prevent recreation on re-renders
  const updateTimeLeft = useMemo(() => () => {
    if (!dueDate) return;
    
    const days = getDaysRemaining(dueDate);
    setDaysLeft(days);
    setTimeDisplay(formatTimeDisplay(days, dueDate, status));
  }, [dueDate, status]);

  useEffect(() => {
    if (!dueDate) {
      setDaysLeft(0);
      setTimeDisplay("No due date");
      return;
    }

    // Initial update
    updateTimeLeft();
    
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    cleanup(); // Clear any existing interval
    
    // Only set interval if we need updates
    if (updateInterval > 0) {
      intervalRef.current = setInterval(updateTimeLeft, updateInterval);
    }

    return cleanup;
  }, [dueDate, status, updateInterval, updateTimeLeft]);

  // Memoize the ARIA label to avoid recalculation
  const ariaLabel = useMemo(() => {
    if (status === "complete") return "Task timer: Completed";
    if (status === "overdue") return `Task timer: ${timeDisplay} overdue`;
    return `Task timer: ${timeDisplay}`;
  }, [status, timeDisplay]);

  return {
    timeDisplay,
    dashOffset,
    tooltipContent,
    ariaLabel
  };
}
