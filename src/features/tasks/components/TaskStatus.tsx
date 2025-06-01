import { memo } from 'react';
import type { Task } from '@/types';
import { getTaskStatus } from '@/features/tasks/utils/taskUiUtils';
import CountdownTimer from './CountdownTimer';

interface TaskStatusProps {
  task: Task;
}

// Custom equality function for TaskStatus props
const arePropsEqual = (
  prevProps: TaskStatusProps,
  nextProps: TaskStatusProps
): boolean => {
  // Only compare properties that affect status rendering
  return (
    prevProps.task.due_date === nextProps.task.due_date &&
    prevProps.task.status === nextProps.task.status
  );
};

function TaskStatus({ task }: TaskStatusProps) {
  const status = getTaskStatus(task);

  return (
    <div className="shrink-0">
      <CountdownTimer dueDate={task.due_date} status={status} />
    </div>
  );
}

export default memo(TaskStatus, arePropsEqual);
