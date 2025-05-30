import { lazy, Suspense } from 'react';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { useFilteredTasks } from '@/features/tasks/hooks/useFilteredTasks';
import TaskFilterNavbar from './TaskFilterNavbar';
import TaskPagination from './TaskPagination';
import { Skeleton } from '@/components/ui/skeleton';
import { FabButton } from '@/components/FabButton';

// Lazy load components that aren't needed on initial render
const TaskCard = lazy(() => import('./TaskCard'));

// Skeleton component for lazy-loaded task cards
const TaskCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

export default function TaskList() {
  // Get data and functions from data context
  const {
    tasks,
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

  // Get UI state from UI context
  const { filter, setFilter } = useTaskUIContext();

  // Get filtered tasks
  const filteredTasks = useFilteredTasks(tasks, filter);

  return (
    <>
      {/* Navbar Section - Completely isolated */}
      <div className="mb-8 w-full px-4 sm:px-6">
        <TaskFilterNavbar filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Task List Section - Completely isolated with no shared containers */}
      <div className="w-full px-4 sm:px-6">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
                <TaskCard task={task} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}

        {/* Pagination Controls */}
        <TaskPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </div>

      {/* Create Task FAB */}
      <FabButton />
    </>
  );
}
