import { useState, useEffect, useRef } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { TaskStatus } from "@/lib/types";
import TimerRing from "./timer/TimerRing";
import TimerDisplay from "./timer/TimerDisplay";
import { useUIContext } from "@/contexts/UIContext";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TimerTooltip from "./timer/TimerTooltip";
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

export default function CountdownTimer({
  dueDate,
  status,
  size = 48,
  priority = "medium",
}: CountdownTimerProps) {
  const { isMobile } = useUIContext();
  
  // Adjust size based on priority and mobile status
  const dynamicSize = isMobile 
    ? (priority === "high" ? size * 1.1 : priority === "low" ? size * 0.7 : size * 0.9)
    : (priority === "high" ? size * 1.2 : priority === "low" ? size * 0.8 : size);
  
  const radius = dynamicSize / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const [daysLeft, setDaysLeft] = useState<number>(dueDate ? getDaysRemaining(dueDate) : 0);
  const [timeDisplay, setTimeDisplay] = useState<string>(dueDate ? formatTimeDisplay(daysLeft, dueDate, status) : "No due date");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipContent = getTooltipContent(dueDate);

  const { strokeDashoffset } = useSpring({
    strokeDashoffset: calculateTimerOffset(circumference, daysLeft, status, dueDate),
    config: { tension: 120, friction: 14 },
    immediate: status === "complete" || status === "overdue" || !dueDate,
  });

  useEffect(() => {
    if (!dueDate) {
      setDaysLeft(0);
      setTimeDisplay("No due date");
      return;
    }

    const updateTimeLeft = () => {
      const days = getDaysRemaining(dueDate);
      setDaysLeft(days);
      setTimeDisplay(formatTimeDisplay(days, dueDate, status));
    };

    updateTimeLeft(); // Initial update
    
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    cleanup(); // Clear any existing interval

    // Set update interval based on remaining time to be more efficient
    const intervalDuration = getUpdateInterval(daysLeft, status);
    
    // Only set interval if we need updates
    if (intervalDuration > 0) {
      intervalRef.current = setInterval(updateTimeLeft, intervalDuration);
    }

    return cleanup;
  }, [dueDate, status, daysLeft]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <AnimatedDiv
            role="timer"
            tabIndex={0}
            aria-label={`Task timer: ${
              status === "complete"
                ? "Completed"
                : status === "overdue"
                ? `${timeDisplay} overdue`
                : `${timeDisplay}`
            }`}
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
