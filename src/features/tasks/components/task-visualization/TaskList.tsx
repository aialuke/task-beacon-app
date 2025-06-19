import { memo, useMemo } from 'react';

import { CardLoader } from '@/components/ui/loading/UnifiedLoadingStates';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { useTasksFilter } from '@/features/tasks/hooks/useTasksFilter';
import type { Task } from '@/types';

import TaskCard from './TaskCard';
import TaskPagination from '../task-interaction/TaskPagination';

function TaskListComponent() {
  const { tasks, isLoading, error, pagination, totalCount, isFetching } =
    useTaskDataContext();

  const { filter, isMobile } = useTaskUIContext();

  // Filter tasks based on current filter
  const filteredTasks = useTasksFilter(tasks, filter);

  // Show pagination if there are multiple pages
  const shouldShowPagination = useMemo(
    () => totalCount > pagination.pageSize,
    [totalCount, pagination.pageSize]
  );

  if (isLoading) {
    return <CardLoader count={3} />;
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
          <div
            className={`space-y-4 sm:space-y-6 ${isMobile ? 'pb-20' : 'pb-6'}`}
          >
            {filteredTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section - Now uses refactored component */}
      {shouldShowPagination && (
        <div className="border-t border-border pt-6">
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
