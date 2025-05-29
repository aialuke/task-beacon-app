import { memo } from 'react';
import { Task } from '@/types';
import TaskHeader from './TaskHeader';

interface TaskCardHeaderProps {
  task: Task;
  isExpanded: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
}

function TaskCardHeader({
  task,
  isExpanded,
  toggleExpand,
  handleTogglePin,
}: TaskCardHeaderProps) {
  return (
    <TaskHeader
      task={task}
      isExpanded={isExpanded}
      toggleExpand={toggleExpand}
      handleTogglePin={handleTogglePin}
    />
  );
}

export default memo(TaskCardHeader);
