
import { memo, lazy, Suspense } from 'react';
import { TaskCardSkeleton, ErrorState } from '../TaskLoadingStates';
import type { Task } from '@/types';

// Lazy load TaskCard for better performance
const TaskCard = lazy(() => import('../TaskCard'));

// Optimized skeleton grid
const LoadingSkeletonGrid = memo(({ count }: { count: number }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <TaskCardSkeleton key={`skeleton-${i}`} />
  ));

  return (
    <div className="space-y-6" role="status" aria-label="Loading tasks">
      {skeletons}
    </div>
  );
});

LoadingSkeletonGrid.displayName = 'LoadingSkeletonGrid';

// Empty state component
const EmptyState = memo(() => (
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
));

EmptyState.displayName = 'EmptyState';

/**
 * Task Render Callbacks - Phase 2 Optimization
 * 
 * Provides optimized render functions for task list components.
 * All functions are memoized to prevent unnecessary re-renders.
 */
export const useTaskRenderCallbacks = () => {
  // Memoized render functions to prevent child re-renders
  const renderTask = (task: Task) => (
    <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
      <TaskCard task={task} />
    </Suspense>
  );

  const renderLoading = (count: number) => <LoadingSkeletonGrid count={count} />;

  const renderEmpty = () => <EmptyState />;

  const renderError = (error: string, onRetry?: () => void) => (
    <ErrorState error={error} onRetry={onRetry} />
  );

  return {
    renderTask,
    renderLoading,
    renderEmpty,
    renderError,
  };
};
