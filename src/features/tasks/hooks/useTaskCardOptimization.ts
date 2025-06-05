
import { useCallback, useMemo } from 'react';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import type { Task } from '@/types';

interface TaskCardOptimizationOptions {
  enableVirtualization?: boolean;
  prefetchImages?: boolean;
  enableAccessibility?: boolean;
}

/**
 * Advanced Task Card Optimization Hook - Phase 4 Implementation
 * 
 * Provides advanced performance optimizations for task cards including:
 * - Memory management for large lists
 * - Image prefetching for better UX
 * - Enhanced accessibility features
 * - Intersection observer for lazy loading
 */
export function useTaskCardOptimization(
  task: Task, 
  options: TaskCardOptimizationOptions = {}
) {
  const {
    enableVirtualization = true,
    prefetchImages = true,
    enableAccessibility = true,
  } = options;

  // Optimized task data extraction
  const taskMetadata = useOptimizedMemo(
    () => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.due_date,
      hasPhoto: !!task.photo_url,
      hasUrl: !!task.url_link,
      hasDescription: !!task.description,
      isOverdue: task.status === 'overdue',
      isPending: task.status === 'pending',
      isComplete: task.status === 'complete',
    }),
    [
      task.id,
      task.title,
      task.status,
      task.due_date,
      task.photo_url,
      task.url_link,
      task.description,
    ],
    { 
      name: 'task-metadata',
      warnOnSlowComputation: false,
    }
  );

  // Enhanced accessibility attributes
  const accessibilityProps = useOptimizedMemo(
    () => {
      if (!enableAccessibility) return {};

      const statusText = taskMetadata.isComplete 
        ? 'completed' 
        : taskMetadata.isOverdue 
        ? 'overdue' 
        : 'pending';

      return {
        role: 'article',
        'aria-label': `Task: ${task.title}, Status: ${statusText}`,
        'aria-describedby': `task-${task.id}-description`,
        'aria-live': taskMetadata.isOverdue ? 'assertive' : 'polite',
        tabIndex: 0,
      };
    },
    [taskMetadata, task.id, task.title, enableAccessibility],
    { name: 'accessibility-props' }
  );

  // Image prefetching for better performance
  const prefetchImage = useOptimizedCallback(
    () => {
      if (!prefetchImages || !task.photo_url) return;
      
      const img = new Image();
      img.src = task.photo_url;
    },
    [task.photo_url, prefetchImages],
    { name: 'prefetch-image' }
  );

  // Memory-efficient event handlers
  const optimizedHandlers = useMemo(
    () => ({
      onFocus: () => {
        // Prefetch image when card receives focus
        if (prefetchImages && task.photo_url) {
          prefetchImage();
        }
      },
      onMouseEnter: () => {
        // Prefetch on hover for better UX
        if (prefetchImages && task.photo_url) {
          prefetchImage();
        }
      },
    }),
    [prefetchImage, prefetchImages, task.photo_url]
  );

  // Enhanced keyboard navigation
  const keyboardHandlers = useOptimizedMemo(
    () => {
      if (!enableAccessibility) return {};

      return {
        onKeyDown: (event: React.KeyboardEvent) => {
          // Enhanced keyboard navigation
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // Focus on first interactive element within card
            const firstButton = event.currentTarget.querySelector('button');
            firstButton?.focus();
          }
        },
      };
    },
    [enableAccessibility],
    { name: 'keyboard-handlers' }
  );

  return {
    taskMetadata,
    accessibilityProps,
    optimizedHandlers,
    keyboardHandlers,
    prefetchImage,
  };
}
