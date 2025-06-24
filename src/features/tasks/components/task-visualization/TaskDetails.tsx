import { cn } from '@/lib/utils';
import { Task } from '@/types';

import TaskDetailsContent from './TaskDetailsContent';

interface TaskDetailsProps {
  task: Task;
  isExpanded: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
}

function TaskDetails({ task, isExpanded, contentRef }: TaskDetailsProps) {
  return (
    <div
      ref={contentRef}
      className={cn(
        'mt-1 w-full overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
      )}
      style={{
        minHeight: 0,
      }}
    >
      <TaskDetailsContent task={task} isExpanded={isExpanded} />
    </div>
  );
}

export default TaskDetails;
