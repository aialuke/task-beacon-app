import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import type { TaskCardProps } from '@/types';

import TaskDetailsContent from './TaskDetailsContent';
import TaskStatus from './TaskStatus';

function TaskCardCollapsible({ task }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Memoized status color mapping to preserve exact visual appearance
  const statusClass = useMemo(() => {
    switch (task.status.toLowerCase()) {
      case 'pending':
        return 'text-amber-500 dark:text-amber-300';
      case 'overdue':
        return 'text-red-600 dark:text-red-400';
      case 'complete':
        return 'text-emerald-600 dark:text-green-400';
      default:
        return 'text-foreground';
    }
  }, [task.status]);

  // Memoized status-based styles
  const statusStyles = useMemo(
    (): React.CSSProperties => ({
      opacity: task.status === 'complete' ? 0.8 : 1,
    }),
    [task.status],
  );

  return (
    <UnifiedErrorBoundary
      variant="inline"
      fallback={
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            Failed to load task: {task.title}
          </p>
        </div>
      }
    >
      <Collapsible
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
        }}
        className={`mx-auto mb-4 box-border w-full max-w-2xl rounded-xl border border-border bg-card p-5 text-card-foreground shadow-task-card transition-all duration-200 hover:shadow-md focus-visible:shadow-md active:shadow-md data-[state=open]:z-10 data-[state=open]:scale-[1.02] data-[state=open]:shadow-expanded ${statusClass} ${
          task.status === 'complete'
            ? 'bg-muted'
            : task.status === 'overdue'
              ? 'border-destructive'
              : ''
        }`}
        style={statusStyles}
      >
        <CollapsibleTrigger asChild>
          <button
            className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Task: ${task.title}`}
          >
            <div className="pointer-events-none">
              <TaskStatus task={task} />
            </div>
            <div className="flex min-w-0 flex-1 items-center">
              <h3 className="mb-0 truncate text-base text-card-foreground sm:text-lg">
                {task.title}
              </h3>
            </div>
            <ChevronDown
              className={`size-4 shrink-0 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="pt-4">
            <TaskDetailsContent task={task} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </UnifiedErrorBoundary>
  );
}

TaskCardCollapsible.displayName = 'TaskCardCollapsible';
export default TaskCardCollapsible;
