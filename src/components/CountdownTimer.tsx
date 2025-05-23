
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { TaskStatus } from "@/lib/types";
import TimerRing from "./timer/TimerRing";
import TimerDisplay from "./timer/TimerDisplay";
import { useUIContext } from "@/contexts/UIContext";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TimerTooltip from "@/features/tasks/components/TimerTooltip";
// Import from new utility files
import { 
  getDaysRemaining,
  formatTimeDisplay,
  getTooltipContent,
  getUpdateInterval
} from "@/lib/dateUtils";
import { 
  calculateTimerOffset, 
  setupAnimationVariables,
  prefersReducedMotion 
} from "@/lib/animationUtils";

interface CountdownTimerProps {
  dueDate: string | null;
  status: TaskStatus;
  size?: number;
  priority?: "low" | "medium" | "high";
}

const AnimatedDiv = animated.div;

function CountdownTimer({
  dueDate,
  status,
  size = 48,
  priority = "medium",
}: CountdownTimerProps) {
  const { isMobile } = useUIContext();
  
  // Calculate and memoize size-related values to avoid recalculation
  const { dynamicSize, radius, circumference } = useMemo(() => {
    const dynamicSize = isMobile 
      ? (priority === "high" ? size * 1.1 : priority === "low" ? size * 0.7 : size * 0.9)
      : (priority === "high" ? size * 1.2 : priority === "low" ? size * 0.8 : size);
    
    const radius = dynamicSize / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    
    return { dynamicSize, radius, circumference };
  }, [isMobile, priority, size]);
  
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
  const tooltipContent = useMemo(() => getTooltipContent(dueDate), [dueDate]);

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

  const { strokeDashoffset } = useSpring({
    strokeDashoffset: dashOffset,
    config: { tension: 120, friction: 14 },
    immediate: status === "complete" || status === "overdue" || !dueDate,
  });

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

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <AnimatedDiv
            role="timer"
            tabIndex={0}
            aria-label={ariaLabel}
            className={`relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full timer-container ${
              status === "pending" && daysLeft === 0 ? "animate-pulse-subtle" : ""
            }`}
            style={{ 
              width: dynamicSize, 
              height: dynamicSize
            }}
          >
            <TimerRing
              size={dynamicSize}
              radius={radius}
              circumference={circumference}
              strokeDashoffset={strokeDashoffset}
              status={status}
            />
            <TimerDisplay 
              size={dynamicSize} 
              status={status} 
              timeDisplay={timeDisplay} 
            />
          </AnimatedDiv>
        </TooltipTrigger>
        <TimerTooltip tooltipContent={tooltipContent} status={status} />
      </Tooltip>
    </TooltipProvider>
  );
}

// Memoize the entire component with a custom comparison function
export default React.memo(CountdownTimer, (prevProps, nextProps) => {
  return prevProps.dueDate === nextProps.dueDate && 
         prevProps.status === nextProps.status &&
         prevProps.size === nextProps.size &&
         prevProps.priority === nextProps.priority;
});
