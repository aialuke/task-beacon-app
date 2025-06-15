
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
  // Fix ref typing - ensure non-null assertion where needed
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { openImagePreview } = useImagePreview();
  const { animationState, isExpanded, toggleExpand } = useTaskAnimation(task);

  const handleImageClick = () => {
    if (task.photo_url) {
      openImagePreview(task.photo_url, task.title);
    }
  };

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
    handleImageClick,
  };
}
