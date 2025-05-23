
import { useState, useEffect, useRef } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { TaskStatus } from "@/lib/types";
import TimerRing from "./timer/TimerRing";
import TimerDisplay from "./timer/TimerDisplay";
import {
  validateDueDate,
  calculateTimerOffset,
  formatTimeDisplay,
} from "@/lib/timer-utils";
import { useUIContext } from "@/contexts/UIContext";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TimerTooltip from "./timer/TimerTooltip";
import { getTooltipContent } from "@/lib/timer-utils";

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
  const [daysLeft, setDaysLeft] = useState<number>(dueDate ? validateDueDate(dueDate) : 0);
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
      const days = validateDueDate(dueDate);
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

    // Set interval duration based on remaining time
    let intervalDuration = 3600000; // Default to hourly updates (3600000ms = 1 hour)
    
    // For tasks due within 24 hours, update more frequently
    if (daysLeft === 0) {
      intervalDuration = 60000; // Update every minute for tasks due today
    }
    
    // For tasks due within 1 hour or overdue tasks, update even more frequently
    const hoursTillDue = dueDate ? Math.floor((new Date(dueDate).getTime() - Date.now()) / 3600000) : 0;
    if (hoursTillDue <= 1 || status === "overdue") {
      intervalDuration = 1000; // Update every second for imminent or overdue tasks
    }
    
    intervalRef.current = setInterval(updateTimeLeft, intervalDuration);

    return cleanup;
  }, [dueDate, status]);

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
              height: dynamicSize,
              background: "var(--gradient-light)",
              boxShadow: "var(--shadow-sm)"
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
