
import { memo, lazy, Suspense } from 'react';
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';
import type { Task } from '@/types';

// Lazy load TaskCard for better performance
const TaskCard = lazy(() => import('../TaskCard'));

// Optimized skeleton grid
const LoadingSkeletonGrid = memo(({ count }: { count: number }) => {
  return (
    <UnifiedLoadingStates variant="card" count={count} />
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

// Error state component
const ErrorState = memo(({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <div className="flex items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8">
    <div className="text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-destructive font-medium">Error loading tasks</p>
      <p className="text-sm text-muted-foreground">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

/**
 * Task Render Callbacks - Phase 2 Optimization
 * 
 * Provides optimized render functions for task list components.
 * All functions are memoized to prevent unnecessary re-renders.
 */
export const useTaskRenderCallbacks = () => {
  // Memoized render functions to prevent child re-renders
  const renderTask = (task: Task) => (
    <Suspense key={task.id} fallback={<UnifiedLoadingStates variant="card" count={1} />}>
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
// CodeRabbit review
// CodeRabbit review
