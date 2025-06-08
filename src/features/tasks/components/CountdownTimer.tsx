import { useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import { TaskStatus } from "@/types";
import TimerRing from "./timer/TimerRing";
import TimerDisplay from "./timer/TimerDisplay";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TimerTooltip from "@/features/tasks/components/TimerTooltip";
import { useCountdown } from "@/features/tasks/hooks/useCountdown";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";

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
  const { shouldReduceMotion, getAnimationConfig } = useMotionPreferences();

  const { dynamicSize, radius, circumference } = useMemo(() => {
    const dynamicSize = isMobile
      ? priority === "high"
        ? size * 1.1
        : priority === "low"
        ? size * 0.7
        : size * 0.9
      : priority === "high"
      ? size * 1.2
      : priority === "low"
      ? size * 0.8
      : size;
    const radius = dynamicSize / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    return { dynamicSize, radius, circumference };
  }, [isMobile, priority, size]);

  const { timeDisplay, dashOffset, tooltipContent, ariaLabel, daysRemaining } =
    useCountdown(dueDate, status, circumference);

  const springConfig = useMemo(
    () =>
      getAnimationConfig(
        { tension: 120, friction: 14 },
        { tension: 300, friction: 30 }
      ),
    [getAnimationConfig]
  );

  const { strokeDashoffset } = useSpring({
    strokeDashoffset: dashOffset,
    config: springConfig,
    immediate:
      status === "complete" ||
      status === "overdue" ||
      !dueDate ||
      shouldReduceMotion,
  });

  const containerStyles = useMemo(
    () => ({
      width: dynamicSize,
      height: dynamicSize,
      transform: shouldReduceMotion ? undefined : "translateZ(0)",
    }),
    [dynamicSize, shouldReduceMotion]
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <AnimatedDiv
            role="timer"
            tabIndex={0}
            aria-label={ariaLabel}
            className={`timer-container relative flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all ${
              status === "pending" &&
              Number(timeDisplay) === 0 &&
              !shouldReduceMotion
                ? "animate-pulse-subtle"
                : ""
            } ${shouldReduceMotion ? "" : "gpu-accelerated"}`}
            style={containerStyles}
          >
            <TimerRing
              size={dynamicSize}
              radius={radius}
              circumference={circumference}
              strokeDashoffset={strokeDashoffset}
              status={status}
              daysRemaining={daysRemaining}
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

export default CountdownTimer;
// CodeRabbit review
// CodeRabbit review
