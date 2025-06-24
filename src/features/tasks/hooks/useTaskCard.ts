import { useRef } from 'react';

import type { Task as _Task } from '@/types';

import { useTaskAnimation } from './useTaskAnimation';

export function useTaskCard(taskId: string) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isExpanded, animationPhase, toggleExpanded } =
    useTaskAnimation(taskId);

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationPhase,
    animationState: animationPhase,
    toggleExpand: toggleExpanded,
  };
}
