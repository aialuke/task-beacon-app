
import { animated, SpringValue } from "@react-spring/web";
import { TaskStatus } from "@/lib/types";
import { getTimerColor } from "@/lib/utils";

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
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="2.5"
        stroke="#E5EDFF"
        style={{ strokeWidth: "2.5px" }}
      />
      {/* Animated foreground circle */}
      <animated.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="4"
        stroke={timerColor}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        strokeLinecap="round"
        className="timer-progress"
        style={{
          filter: status === "overdue" ? "drop-shadow(0 0 8px rgba(223, 100, 65, 0.8))" : "none",
          strokeWidth: "4px",
        }}
      />
    </svg>
  );
};

export default TimerRing;
