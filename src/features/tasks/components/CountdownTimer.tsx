
import { useSpring, animated } from '@react-spring/web';
import { useMemo } from 'react';

import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { TaskStatus } from '@/types';

import { useTaskUIContext } from '../context/TaskUIContext';
import { useCountdown } from '../hooks/useCountdown';

import TimerDisplay from './timer/TimerDisplay';
import TimerRing from './timer/TimerRing';
import TimerTooltip from './TimerTooltip';

interface CountdownTimerProps {
  dueDate: string | null;
  status: TaskStatus;
  size?: number;
  priority?: 'low' | 'medium' | 'high';
}

const AnimatedDiv = animated.div;

function CountdownTimer({
  dueDate,
  status,
  size = 48,
  priority = 'medium',
}: CountdownTimerProps) {
  const { isMobile } = useTaskUIContext();
  const { shouldReduceMotion, getAnimationConfig } = useMotionPreferences();

  const { dynamicSize, radius, circumference } = useMemo(() => {
    const SIZE_MULTIPLIERS = {
      mobile: { high: 1.1, medium: 0.9, low: 0.7 },
      desktop: { high: 1.2, medium: 1.0, low: 0.8 },
    } as const;

    const deviceType = isMobile ? 'mobile' : 'desktop';
    const dynamicSize = size * SIZE_MULTIPLIERS[deviceType][priority];
    const radius = dynamicSize / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    return { dynamicSize, radius, circumference };
  }, [isMobile, priority, size]);

  const { timeDisplay, dashOffset, tooltipContent, ariaLabel, daysRemaining } =
    useCountdown(dueDate, status, circumference);

  const springConfig = useMemo(
    () =>
      getAnimationConfig(
        { tension: 120, friction: 14 },
        { tension: 300, friction: 30 }
      ),
    [getAnimationConfig]
  );

  // Fix React Spring configuration with proper typing
  const springProps = useSpring({
    strokeDashoffset: dashOffset,
    config: springConfig,
    immediate:
      status === 'complete' ||
      status === 'overdue' ||
      !dueDate ||
      shouldReduceMotion,
  });

  const containerStyles = useMemo(
    () => ({
      width: dynamicSize,
      height: dynamicSize,
      transform: shouldReduceMotion ? undefined : 'translateZ(0)',
    }),
    [dynamicSize, shouldReduceMotion]
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <AnimatedDiv
            role="timer"
            tabIndex={0}
            aria-label={ariaLabel}
            className={`timer-container relative flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              status === 'pending' &&
              Number(timeDisplay) === 0 &&
              !shouldReduceMotion
                ? 'animate-pulse-subtle'
                : ''
            } ${shouldReduceMotion ? '' : 'gpu-accelerated'}`}
            style={containerStyles}
          >
            <TimerRing
              size={dynamicSize}
              radius={radius}
              circumference={circumference}
              strokeDashoffset={springProps.strokeDashoffset}
              status={status}
              daysRemaining={daysRemaining}
            />
            <TimerDisplay
              size={dynamicSize}
              status={status}
              timeDisplay={timeDisplay}
            />
          </AnimatedDiv>
        </TooltipTrigger>
        <TimerTooltip tooltipContent={tooltipContent} status={status} />
      </Tooltip>
    </TooltipProvider>
  );
}

export default CountdownTimer;
