
import React, { useMemo } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { TaskStatus } from "@/types";
import TimerRing from "./timer/TimerRing";
import TimerDisplay from "./timer/TimerDisplay";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TimerTooltip from "@/features/tasks/components/TimerTooltip";
import { 
  setupAnimationVariables,
  prefersReducedMotion 
} from "@/lib/animationUtils";
import { useCountdown } from "@/hooks/useCountdown";

/**
 * CountdownTimer component displays a circular timer that visualizes the time remaining
 * until a task's due date.
 * 
 * Features:
 * - Visually displays time left as a circular progress indicator
 * - Adapts display based on task status (pending, complete, overdue)
 * - Shows different styling based on priority
 * - Resizes based on mobile/desktop view
 * - Provides detailed due date information via tooltip
 * 
 * @param dueDate - The due date of the task as an ISO string
 * @param status - The current status of the task
 * @param size - The size of the timer in pixels (default: 48)
 * @param priority - The priority of the task (default: "medium")
 */
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
  const { isMobile } = useTaskUIContext();
  
  // Calculate and memoize size-related values to avoid recalculation
  const { dynamicSize, radius, circumference } = useMemo(() => {
    const dynamicSize = isMobile 
      ? (priority === "high" ? size * 1.1 : priority === "low" ? size * 0.7 : size * 0.9)
      : (priority === "high" ? size * 1.2 : priority === "low" ? size * 0.8 : size);
    
    const radius = dynamicSize / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    
    return { dynamicSize, radius, circumference };
  }, [isMobile, priority, size]);

  // Use our custom hook to manage countdown logic
  const { timeDisplay, dashOffset, tooltipContent, ariaLabel } = useCountdown(
    dueDate, 
    status, 
    circumference
  );

  // Animation for the timer ring
  const { strokeDashoffset } = useSpring({
    strokeDashoffset: dashOffset,
    config: { tension: 120, friction: 14 },
    immediate: status === "complete" || status === "overdue" || !dueDate,
  });

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <AnimatedDiv
            role="timer"
            tabIndex={0}
            aria-label={ariaLabel}
            className={`relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full timer-container ${
              status === "pending" && Number(timeDisplay) === 0 ? "animate-pulse-subtle" : ""
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
