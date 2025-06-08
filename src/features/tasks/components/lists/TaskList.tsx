
// === EXTERNAL LIBRARIES ===
import { memo, useMemo } from "react";

// === INTERNAL UTILITIES ===
import CardLoader from "@/components/ui/loading/CardLoader";

// === COMPONENTS ===
import { TaskCard } from "../cards";
import TaskPagination from "../TaskPagination";

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

  const { filter, isMobile } = useTaskUIContext();

  // Filter tasks based on current filter
  const filteredTasks = useTasksFilter(tasks, filter);

  // Show pagination if there are multiple pages
  const shouldShowPagination = useMemo(
    () => totalCount > pageSize,
    [totalCount, pageSize]
  );

  if (isLoading) {
    return (
      <CardLoader count={3} />
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
      {/* Task List Content */}
      <div className="space-y-4 sm:space-y-6">
        {filteredTasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          <div className={`space-y-4 sm:space-y-6 ${isMobile ? "pb-20" : "pb-6"}`}>
            {filteredTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {shouldShowPagination && (
        <div className="border-t border-border pt-6">
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
      )}
    </div>
  );
}

export default memo(TaskListComponent);
