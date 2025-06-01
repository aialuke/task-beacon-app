import { memo } from 'react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { Pin } from 'lucide-react';
import TaskStatus from './TaskStatus';
import TaskExpandButton from './TaskExpandButton';

interface TaskHeaderProps {
  task: Task;
  isExpanded: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
}

function TaskHeader({
  task,
  isExpanded,
  toggleExpand,
  handleTogglePin,
}: TaskHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <TaskStatus task={task} />

      <div className="flex min-w-0 flex-1 items-center">
        <h3
          className="mb-0 text-base text-card-foreground sm:text-lg"
          title={task.title}
        >
          {task.title}
        </h3>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shadow-none ml-1 h-8 w-8 shrink-0"
        onClick={handleTogglePin}
        title={task.pinned ? 'Unpin task' : 'Pin task'}
      >
        {task.pinned ? (
          <Pin size={16} className="fill-current text-card-foreground" />
        ) : (
          <Pin size={16} className="text-card-foreground opacity-80" />
        )}
      </Button>

      <TaskExpandButton isExpanded={isExpanded} onClick={toggleExpand} />
    </div>
  );
}

export default memo(TaskHeader);
