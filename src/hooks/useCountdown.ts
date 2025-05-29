
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { TaskStatus } from "@/types";
import { 
  getDaysRemaining,
  formatTimeDisplay,
  getUpdateInterval
} from "@/lib/dateUtils";
import { calculateTimerOffset } from "@/lib/animationUtils";
import { performanceMonitor } from "@/lib/performanceUtils";

/**
 * Custom hook for countdown timer functionality with performance monitoring
 * 
 * Manages the timer state, calculations, and update intervals for task countdown displays
 * 
 * @param dueDate - The due date of the task as an ISO string
 * @param status - The current status of the task
 * @param circumference - The circumference of the timer ring for offset calculations
 * @returns The calculated timer state values
 */
export function useCountdown(dueDate: string | null, status: TaskStatus, circumference: number) {
  // Memoize initial calculations to prevent unnecessary work
  const initialValues = useMemo(() => {
    const measurementId = performanceMonitor.startMeasurement('countdown-initial-calc');
    
    const daysLeft = dueDate ? getDaysRemaining(dueDate) : 0;
    const timeDisplay = dueDate ? formatTimeDisplay(daysLeft, dueDate, status) : "No due date";
    
    performanceMonitor.endMeasurement(measurementId);
    
    return { daysLeft, timeDisplay };
  }, [dueDate, status]);
  
  const [daysLeft, setDaysLeft] = useState<number>(initialValues.daysLeft);
  const [timeDisplay, setTimeDisplay] = useState<string>(initialValues.timeDisplay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize tooltip content calculation
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

  // Memoize stroke dash offset calculation with performance monitoring
  const dashOffset = useMemo(() => {
    const measurementId = performanceMonitor.startMeasurement('countdown-offset-calc');
    const result = calculateTimerOffset(circumference, daysLeft, status, dueDate);
    performanceMonitor.endMeasurement(measurementId);
    return result;
  }, [circumference, daysLeft, status, dueDate]);

  // Memoize the update interval calculation
  const updateInterval = useMemo(() => 
    getUpdateInterval(daysLeft, status),
    [daysLeft, status]
  );

  // Optimize the update function with useCallback
  const updateTimeLeft = useCallback(() => {
    if (!dueDate) return;
    
    const measurementId = performanceMonitor.startMeasurement('countdown-update');
    
    const days = getDaysRemaining(dueDate);
    setDaysLeft(days);
    setTimeDisplay(formatTimeDisplay(days, dueDate, status));
    
    performanceMonitor.endMeasurement(measurementId);
  }, [dueDate, status]);

  useEffect(() => {
    if (!dueDate) {
      setDaysLeft(0);
      setTimeDisplay("No due date");
      return;
    }

    // Initial update
    updateTimeLeft();
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set interval if we need updates
    if (updateInterval > 0) {
      intervalRef.current = setInterval(updateTimeLeft, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
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
