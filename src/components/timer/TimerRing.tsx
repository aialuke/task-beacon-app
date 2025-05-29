import { memo, useMemo } from 'react';
import { animated, SpringValue } from '@react-spring/web';
import { TaskStatus } from '@/types';
import { getTimerColor } from '@/lib/uiUtils';

/**
 * TimerRing Component
 *
 * Renders the circular progress indicator for the countdown timer with the appropriate
 * styling based on task status. Uses SVG with gradients and filters for visual effects.
 *
 * @param size - The diameter of the timer ring in pixels
 * @param radius - The radius of the timer ring in pixels
 * @param circumference - The circumference of the timer ring
 * @param strokeDashoffset - The animated stroke dash offset value
 * @param status - The current status of the task
 */
interface TimerRingProps {
  size: number;
  radius: number;
  circumference: number;
  strokeDashoffset: SpringValue<number> | number;
  status: TaskStatus;
}

// Define gradients once outside the component to avoid recreating them on each render
// This is moved to a separate component and memoized to prevent re-renders
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
));

GradientDefs.displayName = 'GradientDefs';

const TimerRing = ({
  size,
  radius,
  circumference,
  strokeDashoffset,
  status,
}: TimerRingProps) => {
  // Memoize derived values that don't need to be recalculated on every render
  const staticProps = useMemo(() => {
    const gradientId =
      status === 'pending'
        ? 'url(#gradientPending)'
        : status === 'overdue'
          ? 'url(#gradientOverdue)'
          : 'url(#gradientComplete)';

    const filterId =
      status === 'overdue'
        ? 'url(#glowOverdue)'
        : status === 'complete'
          ? 'url(#glowComplete)'
          : 'url(#glowPending)';

    const strokeWidth = status === 'overdue' ? '5px' : '4px';

    return { gradientId, filterId, strokeWidth };
  }, [status]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        overflow: 'visible',
      }}
      className="timer-ring"
      aria-hidden="true" // Mark as decorative for accessibility
    >
      <GradientDefs />

      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth="2.5"
        stroke="#F9FAFB"
        style={{ strokeWidth: '2.5px' }}
      />

      {/* Animated foreground circle */}
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

// Use React.memo with a custom equality function to prevent unnecessary re-renders
export default memo(TimerRing, (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.radius === nextProps.radius &&
    prevProps.circumference === nextProps.circumference &&
    prevProps.status === nextProps.status &&
    // For the strokeDashoffset, we need special handling since it might be a SpringValue
    (prevProps.strokeDashoffset === nextProps.strokeDashoffset ||
      (typeof prevProps.strokeDashoffset === 'number' &&
        typeof nextProps.strokeDashoffset === 'number' &&
        prevProps.strokeDashoffset === nextProps.strokeDashoffset))
  );
});
