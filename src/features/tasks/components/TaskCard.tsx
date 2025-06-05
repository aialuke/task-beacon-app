
import { memo } from 'react';
import { Task } from '@/types';
import { useTaskCard } from '../hooks/useTaskCard';
import { getTaskCardStyles, getTaskCardClasses } from '../utils/taskCardStyles';
import { TaskErrorBoundary } from './TaskErrorBoundary';
import TaskCardHeader from './TaskCardHeader';
import TaskCardContent from './TaskCardContent';

interface TaskCardProps {
  task: Task;
}

// Optimized equality check for memoization
const arePropsEqual = (prevProps: TaskCardProps, nextProps: TaskCardProps): boolean => {
  const prev = prevProps.task;
  const next = nextProps.task;

  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.description === next.description &&
    prev.due_date === next.due_date &&
    prev.url_link === next.url_link &&
    prev.status === next.status &&
    prev.photo_url === next.photo_url &&
    prev.updated_at === next.updated_at
  );
};

function TaskCard({ task }: TaskCardProps) {
  const {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
  } = useTaskCard(task);

  const cardStyles = getTaskCardStyles(task, isExpanded);
  const cardClasses = getTaskCardClasses(task, isExpanded);

  return (
    <TaskErrorBoundary
      fallback={
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">Failed to load task: {task.title}</p>
        </div>
      }
    >
      <article 
        ref={cardRef} 
        className={cardClasses} 
        style={cardStyles}
        role="article"
        aria-label={`Task: ${task.title}`}
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
    </TaskErrorBoundary>
  );
}

TaskCard.displayName = 'TaskCard';
export default memo(TaskCard, arePropsEqual);
