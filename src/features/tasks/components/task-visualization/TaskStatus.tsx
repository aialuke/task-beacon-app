import { getTaskStatus } from '@/features/tasks/utils/taskUiUtils';
import type { TaskStatusProps } from '@/types';

import CountdownTimer from '../task-interaction/CountdownTimer';

function TaskStatus({ task }: TaskStatusProps) {
  const status = getTaskStatus(task);
  return (
    <div className="shrink-0">
      <CountdownTimer dueDate={task.due_date} status={status} />
    </div>
  );
}

export default TaskStatus;
