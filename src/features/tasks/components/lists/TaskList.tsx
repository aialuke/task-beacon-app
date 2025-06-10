
// === EXTERNAL LIBRARIES ===
import { memo, useMemo } from "react";

// === INTERNAL UTILITIES ===
import { CardLoader } from "@/components/ui/loading/UnifiedLoadingStates";
// === COMPONENTS ===
// === HOOKS ===
import { useTaskDataContext, useTaskUIContext } from "@/features/tasks/context";
import { useTasksFilter } from "@/features/tasks/hooks/useTasksFilter";
import { getStaggeredDelay } from "@/animations";
// === TYPES ===
import type { Task } from "@/types";

import { TaskCard } from "../cards";
import TaskPagination from "../TaskPagination";

function TaskListComponent() {
  const {
    tasks,
    isLoading,
    error,
    pagination,
    totalCount,
    isFetching,
  } = useTaskDataContext();

  const { filter, isMobile } = useTaskUIContext();

  // Filter tasks based on current filter (ensure it returns array)
  const filteredTasksResult = useTasksFilter(tasks, filter);
  const filteredTasks = Array.isArray(filteredTasksResult) ? filteredTasksResult : [];

  // Show pagination if there are multiple pages
  const shouldShowPagination = useMemo(
    () => totalCount > pagination.pageSize,
    [totalCount, pagination.pageSize]
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
          <p className="text-muted-foreground text-sm">{error}</p>
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
            {filteredTasks.map((task: Task, index: number) => (
              <TaskCard 
                key={task.id} 
                task={task}
                style={{
                  animationDelay: getStaggeredDelay(index),
                }}
                className="animate-fade-in"
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section - Now uses refactored component */}
      {shouldShowPagination && (
        <div className="border-border border-t pt-6">
          <TaskPagination
            pagination={pagination}
            totalCount={totalCount}
            pageSize={pagination.pageSize}
            isFetching={isFetching}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default memo(TaskListComponent);
