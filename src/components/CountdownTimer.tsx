import { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web"; // Correct import
import { getDaysRemaining, getTimerColor } from "@/lib/utils";
import { TaskStatus } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@radix-ui/react-tooltip";

interface CountdownTimerProps {
  dueDate: string;
  status: TaskStatus;
  size?: number;
}

const AnimatedDiv = animated.div;

export default function CountdownTimer({ dueDate, status, size = 48 }: CountdownTimerProps) {
  const radius = size / 2 - 4;
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
    to: { scale: daysLeft <= 1 || status === "overdue" ? 1.15 : 1 },
    loop: daysLeft <= 1 || status === "overdue",
    config: { ...config.wobbly, duration: 500 },
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
        setTimeDisplay(hoursLeft >= 0 ? `${hoursLeft}h` : `${Math.abs(hoursLeft)}h late`);
      } else {
        setTimeDisplay(`${days}d`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, daysLeft < 1 ? 3600000 : 86400000);
    return () => clearInterval(interval);
  }, [dueDate]);

  const tooltipContent = isNaN(new Date(dueDate).getTime())
    ? "Invalid due date"
    : `Due: ${new Date(dueDate).toLocaleDateString()}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <AnimatedDiv
            role="timer"
            tabIndex={0}
            aria-label={`Task timer: ${status === "complete" ? "Completed" : status === "overdue" ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}`}
            aria-describedby="timer-tooltip"
            className="relative focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ width: size, height: size, ...pulseAnimation }}
          >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth="2"
                stroke="#E5EDFF"
              />
              <animated.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth="3"
                stroke={timerColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                strokeLinecap="round"
                style={{
                  filter: daysLeft <= 1 || status === "overdue" ? "drop-shadow(0 0 6px rgba(255, 0, 0, 0.7))" : "none",
                }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center font-medium text-center"
              style={{
                fontSize: `${size / 4}px`,
                background: status === "overdue" ? "rgba(255, 0, 0, 0.1)" : "transparent",
                borderRadius: "50%",
              }}
            >
              {status === "complete" ? (
                <svg width={size / 3} height={size / 3} viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className={status === "overdue" ? "text-destructive" : "text-primary"}>{timeDisplay}</span>
              )}
            </div>
          </AnimatedDiv>
        </TooltipTrigger>
        <TooltipContent
          id="timer-tooltip"
          className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm shadow-lg z-50"
          side="top"
          sideOffset={5}
        >
          <TooltipArrow className="fill-gray-800" />
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}