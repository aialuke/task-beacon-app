import { animated, SpringValue } from "@react-spring/web";
import { memo, useMemo } from "react";

import { TaskStatus } from "@/types";

export interface TimerRingProps {
  size: number;
  radius: number;
  circumference: number;
  strokeDashoffset: SpringValue<number> | number;
  status: TaskStatus;
  daysRemaining: number | null;
}

const GradientDefs = memo(() => (
  <defs>
    <linearGradient id="gradientPending" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFDD24" />
      <stop offset="100%" stopColor="#FFE082" />
    </linearGradient>
    <linearGradient id="gradientOverdue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#DA3E52" />
      <stop offset="100%" stopColor="#E57373" />
    </linearGradient>
    <linearGradient id="gradientComplete" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#34D399" />
    </linearGradient>
    <filter id="glowOverdue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowPending" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowComplete" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
));

GradientDefs.displayName = 'GradientDefs';

const TimerRing = ({
  size,
  radius,
  circumference,
  strokeDashoffset,
  status,
  daysRemaining,
}: TimerRingProps) => {
  const staticProps = useMemo(() => {
    let gradientId: string;
    if (status === "pending" && daysRemaining !== null && daysRemaining >= 5) {
      gradientId = "url(#gradientComplete)";
    } else if (status === "pending") {
      gradientId = "url(#gradientPending)";
    } else if (status === "overdue") {
      gradientId = "url(#gradientOverdue)";
    } else {
      gradientId = "url(#gradientComplete)";
    }
    const filterId =
      status === "overdue"
        ? "url(#glowOverdue)"
        : status === "complete"
        ? "url(#glowComplete)"
        : "url(#glowPending)";
    const strokeWidth = status === "overdue" ? "5px" : "4px";
    return { gradientId, filterId, strokeWidth };
  }, [status, daysRemaining]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
      className="timer-ring"
      aria-hidden="true"
    >
      <GradientDefs />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="2.5"
        stroke="#F9FAFB"
        style={{ strokeWidth: "2.5px" }}
      />
      <animated.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={staticProps.gradientId}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        strokeLinecap="round"
        className="timer-progress"
        style={{
          filter: staticProps.filterId,
          strokeWidth: staticProps.strokeWidth,
        }}
      />
    </svg>
  );
};

export default memo(TimerRing, (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.radius === nextProps.radius &&
    prevProps.circumference === nextProps.circumference &&
    prevProps.status === nextProps.status &&
    prevProps.daysRemaining === nextProps.daysRemaining &&
    (prevProps.strokeDashoffset === nextProps.strokeDashoffset ||
      (typeof prevProps.strokeDashoffset === "number" &&
        typeof nextProps.strokeDashoffset === "number" &&
        prevProps.strokeDashoffset === nextProps.strokeDashoffset))
  );
});
