
import { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { TaskStatus } from "@/lib/types";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TimerRing from "./timer/TimerRing";
import TimerDisplay from "./timer/TimerDisplay";
import TimerTooltip from "./timer/TimerTooltip";
import {
  validateDueDate,
  calculateTimerOffset,
  formatTimeDisplay,
  getTooltipContent
} from "@/lib/timer-utils";

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
  const dynamicSize = priority === "high" ? size * 1.2 : priority === "low" ? size * 0.8 : size;
  const radius = dynamicSize / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const [daysLeft, setDaysLeft] = useState<number>(dueDate ? validateDueDate(dueDate) : 0);
  const [timeDisplay, setTimeDisplay] = useState<string>(dueDate ? formatTimeDisplay(daysLeft, dueDate, status) : "No due date");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { strokeDashoffset } = useSpring({
    strokeDashoffset: calculateTimerOffset(circumference, daysLeft, status, dueDate),
    config: { tension: 120, friction: 14 },
    immediate: status === "complete" || status === "overdue" || !dueDate,
  });

  const pulseAnimation = useSpring({
    from: { scale: 1 },
    to: { scale: daysLeft <= 1 || status === "overdue" ? 1.05 : 1 },
    loop: { reverse: true },
    config: { tension: 80, friction: 30, duration: 2000 },
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

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Use shorter interval for today's tasks to update hours more frequently
      const intervalDuration = days === 0 ? 60000 : 86400000;
      intervalRef.current = setInterval(updateTimeLeft, intervalDuration);
    };

    updateTimeLeft();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dueDate, status]);

  const tooltipContent = getTooltipContent(dueDate);

  return (
    <TooltipProvider>
      <Tooltip>
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
            aria-describedby="timer-tooltip"
            className="relative focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            style={{ width: dynamicSize, height: dynamicSize, ...pulseAnimation }}
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
