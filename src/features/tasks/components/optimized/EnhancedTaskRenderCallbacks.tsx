
import { lazy, Suspense, useMemo } from 'react';
import { TaskCardSkeleton, ErrorState } from '../TaskLoadingStates';
import type { Task } from '@/types';

// Lazy load components
const VirtualizedTaskCard = lazy(() => import('../VirtualizedTaskCard'));
const TaskCard = lazy(() => import('../TaskCard'));

interface EnhancedRenderOptions {
  shouldVirtualize: boolean;
  visibleItems: any[];
  totalHeight: number;
  containerStyles: React.CSSProperties;
  spacerStyles: React.CSSProperties;
  handleScroll: (e: React.UIEvent) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Enhanced Task Render Callbacks - Phase 2 Optimization
 * 
 * Provides optimized render functions with virtualization support.
 */
export const useEnhancedTaskRenderCallbacks = (options: EnhancedRenderOptions) => {
  const {
    shouldVirtualize,
    visibleItems,
    totalHeight,
    containerStyles,
    spacerStyles,
    handleScroll,
    containerRef,
  } = options;

  // Memoized render functions
  const renderCallbacks = useMemo(() => {
    const renderTask = (task: Task) => {
      if (shouldVirtualize) {
        // This will be handled by the virtualized grid
        return null;
      }
      
      return (
        <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
          <TaskCard task={task} />
        </Suspense>
      );
    };

    const renderLoading = (count: number) => {
      const skeletons = Array.from({ length: count }, (_, i) => (
        <TaskCardSkeleton key={`skeleton-${i}`} />
      ));

      return (
        <div className="space-y-6" role="status" aria-label="Loading tasks">
          {skeletons}
        </div>
      );
    };

    const renderEmpty = () => (
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8 min-h-[200px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-muted-foreground font-medium">No tasks found</p>
          <p className="text-sm text-muted-foreground/80">Create your first task to get started</p>
        </div>
      </div>
    );

    const renderError = (error: string, onRetry?: () => void) => (
      <ErrorState error={error} onRetry={onRetry} />
    );

    // Override render function for virtualized lists
    if (shouldVirtualize) {
      const renderVirtualizedTask = () => (
        <div 
          ref={containerRef}
          style={containerStyles}
          onScroll={handleScroll}
          role="list" 
          aria-label="Virtualized task list"
          className="virtualized-task-container"
        >
          <div style={spacerStyles}>
            {visibleItems.map((item: any) => (
              <Suspense key={item.task.id} fallback={
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: item.top, 
                    width: '100%', 
                    height: item.height 
                  }}
                >
                  <TaskCardSkeleton />
                </div>
              }>
                <VirtualizedTaskCard
                  task={item.task}
                  style={{
                    top: item.top,
                    height: item.height,
                  }}
                  index={item.index}
                />
              </Suspense>
            ))}
          </div>
        </div>
      );

      return {
        renderTask: renderVirtualizedTask,
        renderLoading,
        renderEmpty,
        renderError,
      };
    }

    return {
      renderTask,
      renderLoading,
      renderEmpty,
      renderError,
    };
  }, [
    shouldVirtualize,
    visibleItems,
    totalHeight,
    containerStyles,
    spacerStyles,
    handleScroll,
    containerRef,
  ]);

  return renderCallbacks;
};
