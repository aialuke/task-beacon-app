import { memo } from 'react';

import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import type { Task } from '@/types';

import { useTaskCard } from '../../hooks/useTaskCard';

import TaskCardContent from './TaskCardContent';
import TaskCardHeader from './TaskCardHeader';

interface TaskCardProps {
  task: Task;
}

const arePropsEqual = (
  prevProps: TaskCardProps,
  nextProps: TaskCardProps
): boolean => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.updated_at === nextProps.task.updated_at
  );
};

function TaskCard({ task }: TaskCardProps) {
  const { contentRef, cardRef, isExpanded, animationState, toggleExpand } =
    useTaskCard();

  // Dynamic classes
  const statusClass = `status-${task.status.toLowerCase()}`;
  const expandedClass = isExpanded ? 'scale-102 shadow-expanded z-10' : '';

  // Status-based styles
  const statusStyles: React.CSSProperties = {
    opacity: task.status === 'complete' ? 0.8 : 1,
  };

  // Accessibility: Only make the card focusable/clickable when collapsed
  const isCardInteractive = !isExpanded;

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
        className={`mx-auto mb-4 box-border w-full max-w-2xl rounded-xl border border-border bg-card p-5 text-card-foreground shadow-task-card transition-all duration-200 hover:shadow-md ${statusClass} ${expandedClass} ${
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
          onClick: () => toggleExpand(),
          onKeyDown: e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleExpand();
            }
          },
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
export default memo(TaskCard, arePropsEqual);
