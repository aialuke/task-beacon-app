
import { useSpring, config } from '@react-spring/web';
import { useState } from 'react';

export function useTaskAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const animationProps = useSpring({
    height: isExpanded ? 200 : 0, // Use fixed number instead of 'auto'
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
    // Derived state instead of separate tracking
    animationPhase: isExpanded ? 'enter' : 'exit',
  };
}
