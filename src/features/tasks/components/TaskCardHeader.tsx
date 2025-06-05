
import { memo } from 'react';
import { Task } from '@/types';
import TaskHeader from './TaskHeader';

interface TaskCardHeaderProps {
  task: Task;
  isExpanded: boolean;
  toggleExpand: () => void;
}

function TaskCardHeader({
  task,
  isExpanded,
  toggleExpand,
}: TaskCardHeaderProps) {
  return (
    <TaskHeader
      task={task}
      isExpanded={isExpanded}
      toggleExpand={toggleExpand}
    />
  );
}

export default memo(TaskCardHeader);
