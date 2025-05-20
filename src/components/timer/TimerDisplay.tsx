
import { TaskStatus } from "@/lib/types";

interface TimerDisplayProps {
  size: number;
  status: TaskStatus;
  timeDisplay: string;
}

const TimerDisplay = ({ size, status, timeDisplay }: TimerDisplayProps) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center font-medium text-center ${
        status === "overdue" ? "animate-flash" : ""
      }`}
      style={{
        fontSize: `${size / 4}px`,
        background: status === "overdue" ? "rgba(223, 100, 65, 0.1)" : "transparent",
        borderRadius: "50%",
      }}
    >
      {status === "complete" ? (
        <svg
          width={size / 3}
          height={size / 3}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="var(--timer-complete)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: "var(--timer-complete)", strokeWidth: "3px" }}
          />
        </svg>
      ) : (
        <span
          className={
            status === "overdue" ? "text-destructive" : "text-primary"
          }
          style={{
            color: status === "overdue" 
              ? "hsl(var(--destructive))" 
              : "hsl(var(--primary))"
          }}
        >
          {timeDisplay}
        </span>
      )}
    </div>
  );
};

export default TimerDisplay;
