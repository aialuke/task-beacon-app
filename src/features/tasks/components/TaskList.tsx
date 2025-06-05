
import { lazy, Suspense, memo, useMemo } from 'react';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskFiltering } from '@/features/tasks/providers/TaskProviders';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import TaskFilterNavbar from './TaskFilterNavbar';
import TaskPagination from './TaskPagination';
import { Skeleton } from '@/components/ui/skeleton';
import { FabButton } from './FabButton';
import type { Task } from '@/types';

// Lazy load components that aren't needed on initial render
const TaskCard = lazy(() => import('./TaskCard'));

// Optimized skeleton component with consistent styling
const TaskCardSkeleton = memo(() => (
  <div className="animate-pulse rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-muted animate-pulse" />
        <Skeleton className="h-3 w-1/2 bg-muted/80 animate-pulse" />
      </div>
    </div>
  </div>
));

TaskCardSkeleton.displayName = 'TaskCardSkeleton';

// Optimized loading skeleton grid with performance considerations
const LoadingSkeletonGrid = memo(({ count }: { count: number }) => {
  const skeletonElements = useOptimizedMemo(
    () => Array.from({ length: count }, (_, i) => (
      <TaskCardSkeleton key={`skeleton-${i}`} />
    )),
    [count],
    { name: 'skeleton-grid', warnOnSlowComputation: false }
  );

  return (
    <div className="space-y-6" role="status" aria-label="Loading tasks">
      {skeletonElements}
    </div>
  );
});

LoadingSkeletonGrid.displayName = 'LoadingSkeletonGrid';

// Optimized task grid with error boundary considerations
const TaskGrid = memo(({ tasks }: { tasks: Task[] }) => {
  const taskElements = useOptimizedMemo(
    () => tasks.map((task) => (
      <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
        <TaskCard task={task} />
      </Suspense>
    )),
    [tasks],
    { 
      name: 'task-grid',
      warnOnSlowComputation: true,
      trackDependencyChanges: true
    }
  );

  return (
    <div className="space-y-6" role="list" aria-label="Task list">
      {taskElements}
    </div>
  );
});

TaskGrid.displayName = 'TaskGrid';

// Enhanced empty state with better UX
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

// Error state component for better error handling
const ErrorState = memo(({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <div className="flex items-center justify-center rounded-xl border-2 border-destructive/20 bg-destructive/5 p-8 min-h-[200px]">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-destructive font-medium">Failed to load tasks</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

function TaskList() {
  // Get data context for pagination functionality
  const {
    isLoading,
    isFetching,
    error,
    // Pagination props
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    totalCount,
    pageSize,
  } = useTaskDataContext();

  // Use the filtering hook for operations
  const { tasks: filteredTasks, filter, setFilter } = useTaskFiltering();

  // Memoize pagination props to prevent unnecessary re-renders
  const paginationProps = useMemo(() => ({
    currentPage,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isFetching,
    isLoading,
  }), [
    currentPage,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isFetching,
    isLoading,
  ]);

  // Enhanced content rendering with error handling
  const taskListContent = useOptimizedMemo(() => {
    if (error) {
      return <ErrorState error={error} onRetry={() => window.location.reload()} />;
    }
    
    if (isLoading) {
      return <LoadingSkeletonGrid count={pageSize} />;
    }
    
    if (filteredTasks.length > 0) {
      return <TaskGrid tasks={filteredTasks} />;
    }
    
    return <EmptyState />;
  }, [error, isLoading, filteredTasks, pageSize], { 
    name: 'task-list-content',
    warnOnSlowComputation: true 
  });

  return (
    <main className="flex-1 space-y-8" role="main" aria-label="Task management interface">
      {/* Filter Section */}
      <section className="w-full px-4 sm:px-6" aria-label="Task filters">
        <TaskFilterNavbar filter={filter} onFilterChange={setFilter} />
      </section>

      {/* Task List Section */}
      <section className="w-full px-4 sm:px-6" aria-label="Tasks">
        {taskListContent}

        {/* Pagination Controls - Only show if there are tasks or we're loading */}
        {(filteredTasks.length > 0 || isLoading) && (
          <TaskPagination {...paginationProps} />
        )}
      </section>

      {/* Create Task FAB */}
      <FabButton />
    </main>
  );
}

// Export memoized component with display name for debugging
TaskList.displayName = 'TaskList';
export default memo(TaskList);
