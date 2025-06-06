// === EXTERNAL LIBRARIES ===
import { memo, useMemo } from "react";

// === INTERNAL UTILITIES ===
import UnifiedLoadingStates from "@/components/ui/loading/UnifiedLoadingStates";

// === COMPONENTS ===
import TaskCard from "./TaskCard";
import TaskFilterNavbar from "./TaskFilterNavbar";
import TaskListPagination from "./optimized/TaskListPagination";

// === HOOKS ===
import { useTaskDataContext } from "@/features/tasks/context/TaskDataContext";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useTasksFilter } from "@/features/tasks/hooks/useTasksFilter";

// === TYPES ===
import type { Task } from "@/types";

function TaskListComponent() {
  const {
    tasks,
    isLoading,
    error,
    currentPage,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isFetching,
  } = useTaskDataContext();

  const { filter, setFilter, isMobile } = useTaskUIContext();

  // Filter tasks based on current filter
  const filteredTasks = useTasksFilter(tasks, filter);

  // Show pagination if there are multiple pages
  const shouldShowPagination = useMemo(
    () => totalCount > pageSize,
    [totalCount, pageSize]
  );

  if (isLoading) {
    return (
      <UnifiedLoadingStates variant="skeleton" message="Loading tasks..." />
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Bar Section */}
      <div className="w-full">
        <TaskFilterNavbar filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Task List Section */}
      <div className="space-y-4 sm:space-y-6">
        {filteredTasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          <div
            className={`space-y-4 sm:space-y-6 px-4 ${
              isMobile ? "pb-20" : "pb-6"
            }`}
          >
            {filteredTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {shouldShowPagination && (
        <div className="border-t border-border pt-6">
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
        </div>
      )}
    </div>
  );
}

export default memo(TaskListComponent);
