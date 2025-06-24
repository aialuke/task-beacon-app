import { useMemo, useCallback } from 'react';

import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import type { TaskCardProps } from '@/types';

import { useTaskCard } from '../../hooks/useTaskCard';

import TaskCardContent from './TaskCardContent';
import TaskCardHeader from './TaskCardHeader';

function TaskCard({ task }: TaskCardProps) {
  const { contentRef, cardRef, isExpanded, animationState, toggleExpand } =
    useTaskCard(task.id);

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

  // Memoized dynamic classes
  const expandedClass = useMemo(
    () => (isExpanded ? 'scale-[1.02] shadow-expanded z-10' : ''),
    [isExpanded],
  );

  // Memoized status-based styles
  const statusStyles = useMemo(
    (): React.CSSProperties => ({
      opacity: task.status === 'complete' ? 0.8 : 1,
    }),
    [task.status],
  );

  // Accessibility: Only make the card focusable/clickable when collapsed
  const isCardInteractive = !isExpanded;

  // Memoized event handlers
  const handleCardClick = useCallback(() => {
    if (isCardInteractive) {
      toggleExpand();
    }
  }, [isCardInteractive, toggleExpand]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpand();
      }
    },
    [toggleExpand],
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
      <article
        ref={cardRef}
        className={`mx-auto mb-4 box-border w-full max-w-2xl rounded-xl border border-border bg-card p-5 text-card-foreground shadow-task-card transition-all duration-200 hover:shadow-md focus-visible:shadow-md active:shadow-md ${statusClass} ${expandedClass} ${
          task.status === 'complete'
            ? 'bg-muted'
            : task.status === 'overdue'
              ? 'border-destructive'
              : ''
        } ${isCardInteractive ? 'cursor-pointer' : ''}`}
        style={statusStyles}
        aria-label={`Task: ${task.title}`}
        {...(isCardInteractive && {
          role: 'button',
          tabIndex: 0,
          onClick: handleCardClick,
          onKeyDown: handleKeyDown,
        })}
      >
        <TaskCardHeader
          task={task}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
        <TaskCardContent
          task={task}
          isExpanded={isExpanded}
          animationState={animationState}
          contentRef={contentRef}
        />
      </article>
    </UnifiedErrorBoundary>
  );
}

TaskCard.displayName = 'TaskCard';
export default TaskCard;
