import { memo } from 'react';
import { TaskStatus } from '@/types';

/**
 * TimerDisplay Component
 *
 * Renders the time display inside the countdown timer circle.
 * Shows different visual indicators based on task status:
 * - Complete: Displays a checkmark
 * - Overdue: Displays time with warning styling
 * - Pending: Displays time remaining
 *
 * @param size - The diameter of the timer in pixels
 * @param status - The current status of the task
 * @param timeDisplay - The formatted time string to display
 */
interface TimerDisplayProps {
  size: number;
  status: TaskStatus;
  timeDisplay: string;
}

// Custom equality check function
const arePropsEqual = (
  prevProps: TimerDisplayProps,
  nextProps: TimerDisplayProps
): boolean => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.status === nextProps.status &&
    prevProps.timeDisplay === nextProps.timeDisplay
  );
};

const TimerDisplay = ({ size, status, timeDisplay }: TimerDisplayProps) => {
  // Get the appropriate text color based on status
  const getTextColorClass = () => {
    switch (status) {
      case 'complete':
        return 'text-success font-semibold';
      case 'overdue':
        return 'text-destructive font-bold';
      case 'pending':
      default:
        return 'text-primary font-medium';
    }
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center text-center ${
        status === 'overdue' ? 'animate-flash' : ''
      } ${getTextColorClass()}`}
      style={{
        fontSize: `${size / 4}px`,
        background:
          status === 'overdue'
            ? 'rgba(218, 62, 82, 0.1)'
            : status === 'complete'
              ? 'rgba(16, 185, 129, 0.05)'
              : 'transparent',
        borderRadius: '50%',
        boxShadow:
          status === 'overdue'
            ? 'inset 0 0 10px rgba(218, 62, 82, 0.2)'
            : status === 'complete'
              ? 'inset 0 0 8px rgba(16, 185, 129, 0.1)'
              : 'none',
        textShadow:
          status === 'overdue'
            ? '0 1px 2px rgba(218, 62, 82, 0.2)'
            : status === 'complete'
              ? '0 1px 2px rgba(16, 185, 129, 0.2)'
              : '0 1px 2px rgba(54, 98, 227, 0.1)',
      }}
    >
      {status === 'complete' ? (
        <svg
          width={size / 3}
          height={size / 3}
          viewBox="0 0 24 24"
          fill="none"
          className="icon-filled stroke-success text-success"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.2))',
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
          className={`timer-text ${
            status === 'overdue'
              ? 'text-destructive'
              : status === 'pending'
                ? 'text-amber-500'
                : 'text-primary'
          }`}
        >
          {timeDisplay}
        </span>
      )}
    </div>
  );
};

export default memo(TimerDisplay, arePropsEqual);
