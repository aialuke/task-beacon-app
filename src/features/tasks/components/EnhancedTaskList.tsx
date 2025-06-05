
import { lazy, Suspense, memo } from 'react';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskFiltering } from '@/features/tasks/providers/TaskProviders';
import { useTaskListVirtualization } from '../hooks/useTaskListVirtualization';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import TaskFilterNavbar from './TaskFilterNavbar';
import TaskPagination from './TaskPagination';
import { TaskCardSkeleton, TaskPageLoader, ErrorState } from './TaskLoadingStates';
import { FabButton } from './FabButton';

// Lazy load components for better performance
const VirtualizedTaskCard = lazy(() => import('./VirtualizedTaskCard'));
const TaskCard = lazy(() => import('./TaskCard'));

// Enhanced loading skeleton grid
const LoadingSkeletonGrid = memo(({ count }: { count: number }) => {
  const skeletonElements = useOptimizedMemo(
    () => Array.from({ length: count }, (_, i) => (
      <TaskCardSkeleton key={`skeleton-${i}`} />
    )),
    [count],
    { name: 'skeleton-grid' }
  );

  return (
    <div className="space-y-6" role="status" aria-label="Loading tasks">
      {skeletonElements}
    </div>
  );
});

LoadingSkeletonGrid.displayName = 'LoadingSkeletonGrid';

// Virtualized task grid for large lists
const VirtualizedTaskGrid = memo(({ 
  visibleItems, 
  totalHeight, 
  containerStyles, 
  spacerStyles,
  handleScroll,
  containerRef 
}: any) => {
  return (
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
});

VirtualizedTaskGrid.displayName = 'VirtualizedTaskGrid';

// Standard task grid for smaller lists
const StandardTaskGrid = memo(({ tasks }: { tasks: any[] }) => {
  const taskElements = useOptimizedMemo(
    () => tasks.map((task) => (
      <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
        <TaskCard task={task} />
      </Suspense>
    )),
    [tasks],
    { name: 'standard-task-grid' }
  );

  return (
    <div className="space-y-6" role="list" aria-label="Task list">
      {taskElements}
    </div>
  );
});

StandardTaskGrid.displayName = 'StandardTaskGrid';

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
 * Enhanced Task List Component - Phase 4 Implementation
 * 
 * Features:
 * - Virtual scrolling for large lists
 * - Enhanced accessibility
 * - Optimized performance
 * - Better error handling
 * - Memory-efficient rendering
 */
function EnhancedTaskList() {
  const {
    isLoading,
    isFetching,
    error,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    totalCount,
    pageSize,
    retry,
  } = useTaskDataContext();

  const { tasks: filteredTasks, filter, setFilter } = useTaskFiltering();

  // Virtual scrolling for performance
  const {
    containerRef,
    visibleItems,
    totalHeight,
    shouldVirtualize,
    containerStyles,
    spacerStyles,
    handleScroll,
  } = useTaskListVirtualization(filteredTasks, {
    itemHeight: 120,
    containerHeight: 600,
    overscan: 3,
    threshold: 20, // Start virtualizing at 20+ items
  });

  // Pagination props
  const paginationProps = useOptimizedMemo(() => ({
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

  // Enhanced content rendering with virtualization support
  const taskListContent = useOptimizedMemo(() => {
    if (error) {
      return <ErrorState error={error} onRetry={retry} />;
    }
    
    if (isLoading) {
      return <LoadingSkeletonGrid count={pageSize} />;
    }
    
    if (filteredTasks.length === 0) {
      return <EmptyState />;
    }

    // Use virtualization for large lists
    if (shouldVirtualize) {
      return (
        <VirtualizedTaskGrid
          visibleItems={visibleItems}
          totalHeight={totalHeight}
          containerStyles={containerStyles}
          spacerStyles={spacerStyles}
          handleScroll={handleScroll}
          containerRef={containerRef}
        />
      );
    }

    // Use standard grid for smaller lists
    return <StandardTaskGrid tasks={filteredTasks} />;
  }, [
    error,
    retry,
    isLoading,
    pageSize,
    filteredTasks,
    shouldVirtualize,
    visibleItems,
    totalHeight,
    containerStyles,
    spacerStyles,
    handleScroll,
    containerRef,
  ]);

  return (
    <main className="flex-1 space-y-8" role="main" aria-label="Enhanced task management interface">
      {/* Filter Section */}
      <section className="w-full px-4 sm:px-6" aria-label="Task filters">
        <TaskFilterNavbar filter={filter} onFilterChange={setFilter} />
      </section>

      {/* Task List Section */}
      <section className="w-full px-4 sm:px-6" aria-label="Tasks">
        {taskListContent}

        {/* Pagination Controls */}
        {(filteredTasks.length > 0 || isLoading) && (
          <TaskPagination {...paginationProps} />
        )}
      </section>

      {/* Create Task FAB */}
      <FabButton />
    </main>
  );
}

EnhancedTaskList.displayName = 'EnhancedTaskList';
export default memo(EnhancedTaskList);
