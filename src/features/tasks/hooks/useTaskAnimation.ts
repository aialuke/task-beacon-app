import { useSpring, SpringValue, config } from '@react-spring/web';
import { useState } from 'react';

export interface TaskAnimationState {
  height: SpringValue<number>;
  opacity: SpringValue<number>;
}

export function useTaskAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const animationProps = useSpring({
    height: isExpanded ? 'auto' : 0,
    opacity: isExpanded ? 1 : 0,
    config: config.gentle, // Use React Spring's built-in gentle config
    immediate: false,
  });

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return {
    isExpanded,
    toggleExpanded,
    animationState: animationProps,
    // Derived state instead of separate tracking
    animationPhase: isExpanded ? 'enter' : 'exit',
  };
}
