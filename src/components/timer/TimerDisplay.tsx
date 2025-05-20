
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
        background: status === "overdue" ? "rgba(218, 62, 82, 0.1)" : "transparent",
        borderRadius: "50%",
        boxShadow: status === "overdue" ? "inset 0 0 10px rgba(218, 62, 82, 0.2)" : "none"
      }}
    >
      {status === "complete" ? (
        <svg
          width={size / 3}
          height={size / 3}
          viewBox="0 0 24 24"
          fill="none"
          className="text-success stroke-success icon-filled"
          style={{ 
            filter: "drop-shadow(0 1px 2px rgba(16, 185, 129, 0.2))"
          }}
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          className={
            status === "overdue" ? "text-destructive" : "text-primary"
          }
          style={{
            textShadow: status === "overdue" 
              ? "0 1px 2px rgba(218, 62, 82, 0.2)" 
              : "0 1px 2px rgba(54, 98, 227, 0.1)"
          }}
        >
          {timeDisplay}
        </span>
      )}
    </div>
  );
};

export default TimerDisplay;
