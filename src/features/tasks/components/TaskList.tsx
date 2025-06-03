import { lazy, Suspense, memo, useMemo } from 'react';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskFiltering } from '@/features/tasks/providers/TaskProviders';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import TaskFilterNavbar from './TaskFilterNavbar';
import TaskPagination from './TaskPagination';
import { Skeleton } from '@/components/ui/skeleton';
import { FabButton } from './FabButton';

// Lazy load components that aren't needed on initial render
const TaskCard = lazy(() => import('./TaskCard'));

// Skeleton component for lazy-loaded task cards - memoized to prevent recreation
const TaskCardSkeleton = memo(() => (
  <div className="animate-pulse rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
));

TaskCardSkeleton.displayName = 'TaskCardSkeleton';

// Optimized loading skeleton grid - memoized with smart key generation
const LoadingSkeletonGrid = memo(({ count }: { count: number }) => {
  const skeletonElements = useOptimizedMemo(
    () => Array.from({ length: count }, (_, i) => (
      <TaskCardSkeleton key={`skeleton-${i}`} />
    )),
    [count],
    { name: 'skeleton-grid', warnOnSlowComputation: false }
  );

  return <div className="space-y-6">{skeletonElements}</div>;
});

LoadingSkeletonGrid.displayName = 'LoadingSkeletonGrid';

// Optimized task grid with virtualization considerations
const TaskGrid = memo(({ tasks }: { tasks: any[] }) => {
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

  return <div className="space-y-6">{taskElements}</div>;
});

TaskGrid.displayName = 'TaskGrid';

// Empty state component - memoized since it never changes
const EmptyState = memo(() => (
  <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8">
    <p className="text-muted-foreground">No tasks found</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

function TaskList() {
  // Get data context for pagination functionality
  const {
    isLoading,
    isFetching,
    // Pagination props
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    totalCount,
    pageSize,
  } = useTaskDataContext();

  // Use the new convenience hook for filtering operations
  const { tasks: filteredTasks, filter, setFilter } = useTaskFiltering();

  // Memoize pagination props to prevent unnecessary re-renders of TaskPagination
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

  // Optimize content rendering based on state
  const taskListContent = useOptimizedMemo(() => {
    if (isLoading) {
      return <LoadingSkeletonGrid count={pageSize} />;
    }
    
    if (filteredTasks.length > 0) {
      return <TaskGrid tasks={filteredTasks} />;
    }
    
    return <EmptyState />;
  }, [isLoading, filteredTasks, pageSize], { 
    name: 'task-list-content',
    warnOnSlowComputation: true 
  });

  return (
    <>
      {/* Navbar Section - Completely isolated */}
      <div className="mb-8 w-full px-4 sm:px-6">
        <TaskFilterNavbar filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Task List Section - Optimized content rendering */}
      <div className="w-full px-4 sm:px-6">
        {taskListContent}

        {/* Pagination Controls - Memoized props prevent unnecessary re-renders */}
        <TaskPagination {...paginationProps} />
      </div>

      {/* Create Task FAB */}
      <FabButton />
    </>
  );
}

// Export memoized component with shallow equality check for props
export default memo(TaskList);
