import { useState, useEffect, useRef, useCallback } from 'react';
import { getUpdateInterval } from '@/lib/utils/date';

// Clean imports from organized type system
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

/**
 * Custom hook for countdown functionality with performance optimizations
 *
 * @param dueDate - ISO date string or null for task due date
 * @param status - Current task status
 * @returns Object containing countdown values and overdue state
 */
export function useCountdown(dueDate: string | null, status: TaskStatus): CountdownResult {
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

  return state.timeLeft;
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

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  const totalSecondsLeft = Math.floor(difference / 1000);

  return {
    days: days > 0 ? days : 0,
    hours: hours > 0 ? hours : 0,
    minutes: minutes > 0 ? minutes : 0,
    seconds: seconds > 0 ? seconds : 0,
    isOverdue: false,
    totalSecondsLeft,
  };
}
