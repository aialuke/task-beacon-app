import { memo } from 'react';

import type { TaskCardHeaderProps } from '@/types';

import TaskHeader from './TaskHeader';

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
