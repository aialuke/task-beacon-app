
import { memo } from 'react';
import { Task } from '@/types';
import { useTaskCard } from '../hooks/useTaskCard';
import { getTaskCardStyles, getTaskCardClasses } from '../utils/taskCardStyles';
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
    <div ref={cardRef} className={cardClasses} style={cardStyles}>
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
    </div>
  );
}

export default memo(TaskCard, arePropsEqual);
