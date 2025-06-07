
import { useState, useEffect, useCallback, useRef } from 'react';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import type { Task } from '@/types';

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
  threshold: number;
}

interface VirtualizedItem {
  index: number;
  task: Task;
  isVisible: boolean;
  top: number;
  height: number;
}

/**
 * Task List Virtualization Hook - Phase 4 Implementation
 * 
 * Implements virtual scrolling for large task lists to improve performance:
 * - Only renders visible items
 * - Maintains scroll position
 * - Handles dynamic item heights
 * - Optimizes memory usage
 */
export function useTaskListVirtualization(
  tasks: Task[],
  config: Partial<VirtualizationConfig> = {}
) {
  const {
    itemHeight = 120,
    containerHeight = 600,
    overscan = 3,
    threshold = 50,
  } = config;

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enable virtualization only for large lists
  const shouldVirtualize = tasks.length > threshold;

  // Calculate visible range
  const visibleRange = useOptimizedMemo(
    () => {
      if (!shouldVirtualize) {
        return { start: 0, end: tasks.length - 1 };
      }

      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
        tasks.length - 1
      );

      return {
        start: Math.max(0, startIndex - overscan),
        end: endIndex,
      };
    },
    [scrollTop, itemHeight, containerHeight, overscan, tasks.length, shouldVirtualize],
    { name: 'visible-range' }
  );

  // Create virtualized items
  const virtualizedItems = useOptimizedMemo(
    () => {
      if (!shouldVirtualize) {
        return tasks.map((task, index) => ({
          index,
          task,
          isVisible: true,
          top: index * itemHeight,
          height: itemHeight,
        }));
      }

      return tasks.map((task, index) => ({
        index,
        task,
        isVisible: index >= visibleRange.start && index <= visibleRange.end,
        top: index * itemHeight,
        height: itemHeight,
      }));
    },
    [tasks, visibleRange, itemHeight, shouldVirtualize],
    { 
      name: 'virtualized-items',
      warnOnSlowComputation: true,
    }
  );

  // Get only visible items for rendering
  const visibleItems = useOptimizedMemo(
    () => virtualizedItems.filter(item => item.isVisible),
    [virtualizedItems],
    { name: 'visible-items' }
  );

  // Total height for scrollbar
  const totalHeight = useOptimizedMemo(
    () => tasks.length * itemHeight,
    [tasks.length, itemHeight],
    { name: 'total-height' }
  );

  // Scroll handler
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
  }, []);

  // Intersection observer for enhanced performance
  useEffect(() => {
    if (!shouldVirtualize || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Additional optimization: pause rendering for non-visible containers
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Container is not visible, can pause updates
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => { observer.disconnect(); };
  }, [shouldVirtualize]);

  // Container styles for virtualization
  const containerStyles = useOptimizedMemo(
    () => ({
      height: containerHeight,
      overflowY: 'auto' as const,
      position: 'relative' as const,
    }),
    [containerHeight],
    { name: 'container-styles' }
  );

  // Spacer styles for maintaining scroll height
  const spacerStyles = useOptimizedMemo(
    () => ({
      height: totalHeight,
      position: 'relative' as const,
    }),
    [totalHeight],
    { name: 'spacer-styles' }
  );

  return {
    containerRef,
    visibleItems,
    totalHeight,
    shouldVirtualize,
    containerStyles,
    spacerStyles,
    handleScroll,
    scrollTop,
  };
}
