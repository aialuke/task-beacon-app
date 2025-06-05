
import { memo } from 'react';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskFiltering } from '@/features/tasks/providers/TaskProviders';
import TaskListCore from './optimized/TaskListCore';
import TaskListFilters from './optimized/TaskListFilters';
import TaskListPagination from './optimized/TaskListPagination';
import { FabButton } from './FabButton';
import { useTaskRenderCallbacks } from './optimized/TaskRenderCallbacks';

/**
 * Task List Component - Phase 2 Optimized
 * 
 * Refactored to use smaller, focused components with React.memo optimization.
 * Reduces unnecessary re-renders and improves performance.
 */
function TaskList() {
  // Get data context for pagination functionality
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
  } = useTaskDataContext();

  // Use the filtering hook for operations
  const { tasks: filteredTasks, filter, setFilter } = useTaskFiltering();

  // Get optimized render callbacks
  const { renderTask, renderLoading, renderEmpty, renderError } = useTaskRenderCallbacks();

  // Determine if pagination should be shown
  const shouldShowPagination = filteredTasks.length > 0 || isLoading;

  // Retry function for error state
  const handleRetry = () => window.location.reload();

  return (
    <main className="flex-1 space-y-8" role="main" aria-label="Task management interface">
      {/* Filter Section */}
      <TaskListFilters filter={filter} onFilterChange={setFilter} />

      {/* Task List Section */}
      <section className="w-full px-4 sm:px-6" aria-label="Tasks">
        <TaskListCore
          tasks={filteredTasks}
          loading={isLoading}
          error={error}
          onRetry={handleRetry}
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

TaskList.displayName = 'TaskList';
export default memo(TaskList);
