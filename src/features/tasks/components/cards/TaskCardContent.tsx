import { SpringValue } from '@react-spring/web';
import { memo } from 'react';

import { Task } from '@/types';

import TaskDetails from '../display/TaskDetails';

interface TaskCardContentProps {
  task: Task;
  isExpanded: boolean;
  animationState: {
    height: SpringValue<number>;
    opacity: SpringValue<number>;
  };
  contentRef: React.RefObject<HTMLDivElement>;
}

function TaskCardContent({
  task,
  isExpanded,
  animationState,
  contentRef,
}: TaskCardContentProps) {
  return (
    <TaskDetails
      task={task}
      isExpanded={isExpanded}
      animationState={animationState}
      contentRef={contentRef}
    />
  );
}

export default memo(TaskCardContent);
