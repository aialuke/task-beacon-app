import type { TaskCardContentProps } from '@/types';

import TaskDetails from './TaskDetails';

interface ExtendedTaskCardContentProps extends TaskCardContentProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

function TaskCardContent({
  task,
  isExpanded,
  contentRef,
}: ExtendedTaskCardContentProps) {
  return (
    <TaskDetails task={task} isExpanded={isExpanded} contentRef={contentRef} />
  );
}

export default TaskCardContent;
