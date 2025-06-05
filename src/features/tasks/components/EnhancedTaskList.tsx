
import { memo } from 'react';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskFiltering } from '@/features/tasks/providers/TaskProviders';
import { useTaskListVirtualization } from '../hooks/useTaskListVirtualization';
import TaskListCore from './optimized/TaskListCore';
import TaskListFilters from './optimized/TaskListFilters';
import TaskListPagination from './optimized/TaskListPagination';
import { FabButton } from './FabButton';
import { useEnhancedTaskRenderCallbacks } from './optimized/EnhancedTaskRenderCallbacks';

/**
 * Enhanced Task List Component - Phase 2 Optimized
 * 
 * Refactored version with virtual scrolling and optimized component structure.
 * Reduces re-renders and improves performance for large lists.
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
    threshold: 20,
  });

  // Get enhanced render callbacks with virtualization support
  const { 
    renderTask, 
    renderLoading, 
    renderEmpty, 
    renderError 
  } = useEnhancedTaskRenderCallbacks({
    shouldVirtualize,
    visibleItems,
    totalHeight,
    containerStyles,
    spacerStyles,
    handleScroll,
    containerRef,
  });

  const shouldShowPagination = filteredTasks.length > 0 || isLoading;

  return (
    <main className="flex-1 space-y-8" role="main" aria-label="Enhanced task management interface">
      {/* Filter Section */}
      <TaskListFilters filter={filter} onFilterChange={setFilter} />

      {/* Task List Section */}
      <section className="w-full px-4 sm:px-6" aria-label="Tasks">
        <TaskListCore
          tasks={filteredTasks}
          loading={isLoading}
          error={error}
          onRetry={retry}
          renderTask={renderTask}
          renderLoading={renderLoading}
          renderEmpty={renderEmpty}
          renderError={renderError}
          pageSize={pageSize}
        />

        {/* Pagination Controls */}
        <TaskListPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          isFetching={isFetching}
          isLoading={isLoading}
          shouldShow={shouldShowPagination}
        />
      </section>

      {/* Create Task FAB */}
      <FabButton />
    </main>
  );
}

EnhancedTaskList.displayName = 'EnhancedTaskList';
export default memo(EnhancedTaskList);
