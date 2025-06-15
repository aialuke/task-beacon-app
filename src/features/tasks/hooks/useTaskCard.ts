
import { useRef } from 'react';

import type { Task } from '@/types';

import { useImagePreview } from './useImagePreview';
import { useTaskAnimation } from './useTaskAnimation';

/**
 * Task Card Hook - Phase 1 Architecture Fix
 * 
 * Consolidates card-specific logic without business logic concerns.
 * Business logic moved to useTaskCardLogic for better separation.
 */
export function useTaskCard(task: Task) {
  // Fix ref typing - ensure proper HTMLDivElement type
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { openPreview } = useImagePreview();
  const { animationState, isExpanded, toggleExpanded } = useTaskAnimation();

  const handleImageClick = () => {
    if (task.photo_url) {
      openPreview(task.photo_url);
    }
  };

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand: toggleExpanded,
    handleImageClick,
  };
}
