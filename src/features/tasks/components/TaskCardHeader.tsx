import { memo } from 'react';
import { Task } from '@/types';
import TaskHeader from './TaskHeader';

interface TaskCardHeaderProps {
  task: Task;
  isExpanded: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
  isPinLoading?: boolean;
}

function TaskCardHeader({
  task,
  isExpanded,
  toggleExpand,
  handleTogglePin,
  isPinLoading,
}: TaskCardHeaderProps) {
  return (
    <TaskHeader
      task={task}
      isExpanded={isExpanded}
      toggleExpand={toggleExpand}
      handleTogglePin={handleTogglePin}
      isPinLoading={isPinLoading}
    />
  );
}

export default memo(TaskCardHeader);
