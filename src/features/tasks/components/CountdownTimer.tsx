import { useSpring, animated } from '@react-spring/web';
import { useMemo } from 'react';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import TimerTooltip from '@/features/tasks/components/TimerTooltip';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { useCountdown } from '@/features/tasks/hooks/useCountdown';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { TaskStatus } from '@/types';

import TimerDisplay from './timer/TimerDisplay';
import TimerRing from './timer/TimerRing';

interface CountdownTimerProps {
  dueDate: string | null;
  status: TaskStatus;
  size?: number;
}

const AnimatedDiv = animated.div;

function CountdownTimer({ dueDate, status, size = 48 }: CountdownTimerProps) {
  const { isMobile } = useTaskUIContext();
  const { shouldReduceMotion, getAnimationConfig } = useMotionPreferences();

  const { dynamicSize, radius, circumference } = useMemo(() => {
    // Remove priority-based sizing, use a single multiplier per deviceType
    const SIZE_MULTIPLIERS = {
      mobile: 0.9,
      desktop: 1.0,
    } as const;

    const deviceType = isMobile ? 'mobile' : 'desktop';
    const dynamicSize = size * SIZE_MULTIPLIERS[deviceType];
    const radius = dynamicSize / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    return { dynamicSize, radius, circumference };
  }, [isMobile, size]);

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

  const { strokeDashoffset } = useSpring({
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
            } ${shouldReduceMotion ? '' : 'transform-gpu backface-hidden'}`}
            style={containerStyles}
          >
            <TimerRing
              size={dynamicSize}
              radius={radius}
              circumference={circumference}
              strokeDashoffset={strokeDashoffset}
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
