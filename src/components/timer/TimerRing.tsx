
import { animated, SpringValue } from "@react-spring/web";
import { TaskStatus } from "@/lib/types";
import { getTimerColor } from "@/lib/uiUtils";

interface TimerRingProps {
  size: number;
  radius: number;
  circumference: number;
  strokeDashoffset: SpringValue<number> | number;
  status: TaskStatus;
}

const TimerRing = ({
  size,
  radius,
  circumference,
  strokeDashoffset,
  status,
}: TimerRingProps) => {
  const timerColor = getTimerColor(status);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ 
        overflow: "visible",
      }}
      className="timer-ring"
    >
      {/* Define gradients for different status types */}
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
        
        {/* Add filters for glow effects */}
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

      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="2.5"
        stroke="#F9FAFB"
        style={{ strokeWidth: "2.5px" }}
      />
      
      {/* Animated foreground circle */}
      <animated.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="4"
        stroke={status === "pending" ? "url(#gradientPending)" : 
               status === "overdue" ? "url(#gradientOverdue)" : 
               "url(#gradientComplete)"}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        strokeLinecap="round"
        className="timer-progress"
        style={{
          filter: status === "overdue" 
            ? "url(#glowOverdue)" 
            : status === "complete"
              ? "url(#glowComplete)"
              : "url(#glowPending)",
          strokeWidth: status === "overdue" ? "5px" : "4px",
        }}
      />
    </svg>
  );
};

export default TimerRing;
