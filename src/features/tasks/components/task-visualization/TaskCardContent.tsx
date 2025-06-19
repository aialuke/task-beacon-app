import { SpringValue } from '@react-spring/web';
import { memo } from 'react';

import type { TaskCardContentProps } from '@/types';

import TaskDetails from './TaskDetails';

interface ExtendedTaskCardContentProps extends TaskCardContentProps {
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
}: ExtendedTaskCardContentProps) {
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
