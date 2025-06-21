import { useState, startTransition } from 'react';

export function useTaskAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    startTransition(() => {
      setIsExpanded(prev => !prev);
    });
  };

  return {
    isExpanded,
    toggleExpanded,
    animationPhase: isExpanded ? 'enter' : 'exit',
  };
}
