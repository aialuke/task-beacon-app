
import { useRef } from 'react';
import { useTaskAnimation } from './useTaskAnimation';
import type { Task } from '@/types';

/**
 * Custom hook for managing task card state and behavior
 * 
 * Handles:
 * - Animation state management
 * - Task expansion/collapse
 * - Ref management for DOM elements
 */
export function useTaskCard(task: Task) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    isExpanded,
    animationState,
    toggleExpanded,
  } = useTaskAnimation(contentRef);

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand: toggleExpanded,
  };
}
