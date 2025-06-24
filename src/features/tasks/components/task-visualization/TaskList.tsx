import { useMemo } from 'react';

import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { useTasksFilter } from '@/features/tasks/hooks/useTasksFilter';
import type { Task } from '@/types';

import TaskPagination from '../task-interaction/TaskPagination';

import TaskCardCollapsible from './TaskCardCollapsible';

function TaskListComponent() {
  const { tasks, pagination, totalCount, isFetching } = useTaskDataContext();

  const { filter, isMobile } = useTaskUIContext();

  // Filter tasks based on current filter
  const filteredTasks = useTasksFilter(tasks, filter);

  // Show pagination if there are multiple pages
  const shouldShowPagination = useMemo(
    () => totalCount > pagination.pageSize,
    [totalCount, pagination.pageSize],
  );

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
              <TaskCardCollapsible key={task.id} task={task} />
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
          />
        </div>
      )}
    </div>
  );
}

export default TaskListComponent;
