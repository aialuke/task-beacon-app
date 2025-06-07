import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getUpdateInterval, formatTimeDisplay, getDaysRemaining } from '@/lib/utils/date';
import { calculateTimerOffset } from '@/lib/utils/animation';
import type { TaskStatus } from '@/types';

interface CountdownResult {
  days: number | null;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
  isOverdue: boolean;
  totalSecondsLeft: number | null;
}

interface CountdownState {
  timeLeft: CountdownResult;
  interval: number;
}

interface CountdownTimerResult {
  timeDisplay: string;
  dashOffset: number;
  tooltipContent: string;
  ariaLabel: string;
  daysRemaining: number | null;
}

/**
 * Custom hook for countdown functionality with performance optimizations
 *
 * @param dueDate - ISO date string or null for task due date
 * @param status - Current task status
 * @param circumference - The circumference of the timer ring for calculating dash offset
 * @returns Object containing formatted time display, dash offset, tooltip content, and aria label
 */
export function useCountdown(
  dueDate: string | null, 
  status: TaskStatus, 
  circumference: number
): CountdownTimerResult {
  const [state, setState] = useState<CountdownState>(() => {
    const initialTimeLeft = calculateTimeLeft(dueDate, status);
    const initialInterval = getUpdateInterval(initialTimeLeft.days, status);

    return {
      timeLeft: initialTimeLeft,
      interval: initialInterval,
    };
  });

  const lastCalculationRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimize calculation frequency
  const calculateWithThrottle = useCallback((currentDueDate: string | null, currentStatus: TaskStatus) => {
    const now = Date.now();
    const timeSinceLastCalc = now - lastCalculationRef.current;

    // Throttle calculations to avoid excessive computation
    if (timeSinceLastCalc < 100) {
      return state.timeLeft;
    }

    lastCalculationRef.current = now;
    return calculateTimeLeft(currentDueDate, currentStatus);
  }, [state.timeLeft]);

  // Update countdown when props change or interval triggers
  const updateCountdown = useCallback(() => {
    const newTimeLeft = calculateWithThrottle(dueDate, status);
    const newInterval = getUpdateInterval(newTimeLeft.days, status);

    // Only update state if values actually changed
    if (
      newTimeLeft.days !== state.timeLeft.days ||
      newTimeLeft.hours !== state.timeLeft.hours ||
      newTimeLeft.minutes !== state.timeLeft.minutes ||
      newTimeLeft.seconds !== state.timeLeft.seconds ||
      newTimeLeft.isOverdue !== state.timeLeft.isOverdue ||
      newInterval !== state.interval
    ) {
      setState({
        timeLeft: newTimeLeft,
        interval: newInterval,
      });
    }
  }, [dueDate, status, state.timeLeft, state.interval, calculateWithThrottle]);

  // Set up interval based on how close the due date is
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (state.interval > 0) {
      updateCountdown(); // Update immediately
      intervalRef.current = setInterval(updateCountdown, state.interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.interval, updateCountdown]);

  // Memoize the computed values that depend on the countdown state
  const computedValues = useMemo(() => {
    const { timeLeft } = state;
    
    // Format the time display
    const timeDisplay = formatTimeDisplay(timeLeft.days, dueDate, status);
    
    // Calculate dash offset for the timer ring
    const dashOffset = calculateTimerOffset(
      circumference,
      timeLeft.days ?? 0,
      status,
      dueDate
    );
    
    // Generate tooltip content
    let tooltipContent = '';
    if (status === 'complete') {
      tooltipContent = 'Task completed';
    } else if (status === 'overdue') {
      tooltipContent = 'Task is overdue';
    } else if (!dueDate) {
      tooltipContent = 'No due date set';
    } else if (timeLeft.isOverdue) {
      tooltipContent = 'Task is overdue';
    } else if (timeLeft.days === 0) {
      tooltipContent = 'Due today';
    } else if (timeLeft.days === 1) {
      tooltipContent = 'Due tomorrow';
    } else if (timeLeft.days !== null && timeLeft.days > 1) {
      tooltipContent = `Due in ${timeLeft.days} days`;
    } else {
      tooltipContent = 'Due date approaching';
    }
    
    // Generate aria label for accessibility
    let ariaLabel = '';
    if (status === 'complete') {
      ariaLabel = 'Task timer: Completed';
    } else if (status === 'overdue') {
      ariaLabel = 'Task timer: Overdue';
    } else if (!dueDate) {
      ariaLabel = 'Task timer: No due date';
    } else if (timeLeft.days === 0) {
      ariaLabel = 'Task timer: Due today';
    } else if (timeLeft.days === 1) {
      ariaLabel = 'Task timer: Due tomorrow';
    } else if (timeLeft.days !== null && timeLeft.days > 1) {
      ariaLabel = `Task timer: ${timeLeft.days} days remaining`;
    } else {
      ariaLabel = 'Task timer: Due soon';
    }
    
    return {
      timeDisplay,
      dashOffset,
      tooltipContent,
      ariaLabel,
      daysRemaining: timeLeft.days,
    };
  }, [state.timeLeft, dueDate, status, circumference]);

  return computedValues;
}

/**
 * Calculate time remaining until due date
 */
function calculateTimeLeft(dueDate: string | null, status: TaskStatus): CountdownResult {
  const nullResult: CountdownResult = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    isOverdue: false,
    totalSecondsLeft: null,
  };

  if (!dueDate || status === 'complete') {
    return nullResult;
  }

  // Use the same day calculation logic as getDaysRemaining for consistency
  const daysRemaining = getDaysRemaining(dueDate);
  
  if (daysRemaining === null) {
    return nullResult;
  }

  if (daysRemaining < 0) {
    return {
      days: Math.abs(daysRemaining),
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOverdue: true,
      totalSecondsLeft: 0,
    };
  }

  // For more detailed time calculations (hours, minutes, seconds), 
  // still use the original method but base it on the normalized days
  const now = new Date().getTime();
  const targetDate = new Date(dueDate).getTime();
  const difference = targetDate - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOverdue: true,
      totalSecondsLeft: 0,
    };
  }

  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  const totalSecondsLeft = Math.floor(difference / 1000);

  return {
    days: daysRemaining,
    hours: hours > 0 ? hours : 0,
    minutes: minutes > 0 ? minutes : 0,
    seconds: seconds > 0 ? seconds : 0,
    isOverdue: false,
    totalSecondsLeft,
  };
}
