
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
 * Task List Virtualization Hook - Simplified Implementation
 * 
 * Uses standard React patterns for virtual scrolling optimization.
 * Simplified approach focusing on actual performance benefits.
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

  // Calculate visible range using standard useMemo
  const visibleRange = useMemo(
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
    [scrollTop, itemHeight, containerHeight, overscan, tasks.length, shouldVirtualize]
  );

  // Create virtualized items using standard useMemo
  const virtualizedItems = useMemo(
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
    [tasks, visibleRange, itemHeight, shouldVirtualize]
  );

  // Get only visible items for rendering
  const visibleItems = useMemo(
    () => virtualizedItems.filter(item => item.isVisible),
    [virtualizedItems]
  );

  // Total height for scrollbar
  const totalHeight = useMemo(
    () => tasks.length * itemHeight,
    [tasks.length, itemHeight]
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
  const containerStyles = useMemo(
    () => ({
      height: containerHeight,
      overflowY: 'auto' as const,
      position: 'relative' as const,
    }),
    [containerHeight]
  );

  // Spacer styles for maintaining scroll height
  const spacerStyles = useMemo(
    () => ({
      height: totalHeight,
      position: 'relative' as const,
    }),
    [totalHeight]
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
