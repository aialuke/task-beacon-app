import { startTransition } from 'react';

import { useTaskUIContext } from '../context/TaskUIContext';

export function useTaskAnimation(taskId: string) {
  const { expandedTaskId, setExpandedTaskId } = useTaskUIContext();
  const isExpanded = expandedTaskId === taskId;

  const toggleExpanded = () => {
    startTransition(() => {
      setExpandedTaskId(isExpanded ? null : taskId);
    });
  };

  return {
    isExpanded,
    toggleExpanded,
    animationPhase: isExpanded ? 'enter' : 'exit',
  };
}
