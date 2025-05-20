
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
      style={{ overflow: "visible" }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="2"
        stroke="#E5EDFF"
      />
      {/* Animated foreground circle */}
      <animated.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="3.6"
        stroke={timerColor}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        strokeLinecap="round"
        style={{
          filter: status === "overdue" ? "drop-shadow(0 0 8px rgba(223, 100, 65, 0.8))" : "none",
        }}
      />
    </svg>
  );
};

export default TimerRing;
