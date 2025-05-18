
import { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { getDaysRemaining, getTimerColor } from "@/lib/utils";
import { TaskStatus } from "@/lib/types";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger, 
  TooltipArrow 
} from "@/components/ui/tooltip";

interface CountdownTimerProps {
  dueDate: string;
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
  const [daysLeft, setDaysLeft] = useState<number>(getDaysRemaining(dueDate));
  const [timeDisplay, setTimeDisplay] = useState<string>(`${daysLeft}d`);
  const timerColor = getTimerColor(status);

  const validateDueDate = (date: string): number => {
    const due = new Date(date).getTime();
    if (isNaN(due)) return 0;
    const now = Date.now();
    return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  };

  const calculateOffset = () => {
    if (status === "complete") return 0;
    if (status === "overdue") return circumference;
    const totalDays = 14;
    const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
    return circumference * (1 - remainingPercentage);
  };

  const { strokeDashoffset } = useSpring({
    strokeDashoffset: calculateOffset(),
    config: { tension: 120, friction: 14 },
    immediate: status === "complete",
  });

  const pulseAnimation = useSpring({
    from: { scale: 1 },
    to: { scale: daysLeft <= 1 || status === "overdue" ? 1.05 : 1 },
    loop: { reverse: true },
    config: { tension: 80, friction: 30, duration: 6000 },
  });

  useEffect(() => {
    const updateTimeLeft = () => {
      const days = validateDueDate(dueDate);
      setDaysLeft(days);
      if (days === 0 && new Date(dueDate).toDateString() === new Date().toDateString()) {
        setTimeDisplay("Today");
      } else if (days < 1) {
        const due = new Date(dueDate).getTime();
        const now = Date.now();
        const hoursLeft = Math.floor((due - now) / (1000 * 60 * 60));
        if (hoursLeft < 1 && hoursLeft >= 0) {
          const minutesLeft = Math.floor((due - now) / (1000 * 60));
          setTimeDisplay(`${minutesLeft}m`);
        } else {
          setTimeDisplay(`${hoursLeft}h`);
        }
      } else if (days < 0) {
        setTimeDisplay(`${days}d`);
      } else {
        setTimeDisplay(`${days}d`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, daysLeft < 1 ? 60000 : 86400000);
    return () => clearInterval(interval);
  }, [dueDate]);

  const tooltipContent = isNaN(new Date(dueDate).getTime())
    ? "Invalid due date"
    : `Due: ${new Date(dueDate).toLocaleDateString()}`;

  const getStatusTooltipClass = () => {
    if (status === "overdue") return "bg-destructive text-destructive-foreground";
    if (status === "complete") return "bg-success text-success-foreground";
    return "bg-gray-900 text-white";
  };

  const getTooltipArrowClass = () => {
    if (status === "overdue") return "fill-destructive";
    if (status === "complete") return "fill-success";
    return "fill-gray-900";
  };

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
                  : `${timeDisplay} remaining`
            }`}
            aria-describedby="timer-tooltip"
            className="relative focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            style={{ width: dynamicSize, height: dynamicSize, ...pulseAnimation }}
          >
            <svg width={dynamicSize} height={dynamicSize} viewBox={`0 0 ${dynamicSize} ${dynamicSize}`}>
              <circle
                cx={dynamicSize / 2}
                cy={dynamicSize / 2}
                r={radius}
                fill="none"
                strokeWidth="2"
                stroke="#E5EDFF"
              />
              <animated.circle
                cx={dynamicSize / 2}
                cy={dynamicSize / 2}
                r={radius}
                fill="none"
                strokeWidth="3"
                stroke={timerColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90, ${dynamicSize / 2}, ${dynamicSize / 2})`}
                strokeLinecap="round"
                style={{
                  filter: daysLeft <= 1 || status === "overdue" ? "drop-shadow(0 0 8px rgba(255, 0, 0, 0.8))" : "none",
                }}
              />
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center font-medium text-center ${
                status === "overdue" ? "animate-flash" : ""
              }`}
              style={{
                fontSize: `${dynamicSize / 4}px`,
                background: status === "overdue" ? "rgba(255, 0, 0, 0.1)" : "transparent",
                borderRadius: "50%",
              }}
            >
              {status === "complete" ? (
                <svg width={dynamicSize / 3} height={dynamicSize / 3} viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M20 6L9 17L4 12" 
                    stroke="var(--timer-complete)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              ) : (
                <span className={status === "overdue" ? "text-destructive" : "text-primary"}>
                  {timeDisplay}
                </span>
              )}
            </div>
          </AnimatedDiv>
        </TooltipTrigger>
        <TooltipContent
          id="timer-tooltip"
          className={`px-5 py-3 rounded-lg text-lg shadow-xl z-50 ${getStatusTooltipClass()}`}
          side="top"
          sideOffset={10}
        >
          <TooltipArrow className={getTooltipArrowClass()} />
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
