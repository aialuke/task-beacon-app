
import { useSpring, SpringValue, config } from '@react-spring/web';
import { useState } from 'react';

interface TaskAnimationState {
  height: SpringValue<number>;
  opacity: SpringValue<number>;
}

export function useTaskAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const animationProps = useSpring({
    height: isExpanded ? 200 : 0, // Use specific number instead of 'auto'
    opacity: isExpanded ? 1 : 0,
    config: config.gentle,
    immediate: false,
  });

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return {
    isExpanded,
    toggleExpanded,
    animationState: animationProps,
    animationPhase: isExpanded ? 'enter' : 'exit',
  };
}
