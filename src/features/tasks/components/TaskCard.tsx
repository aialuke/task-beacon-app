import { memo } from 'react';
import { Task } from '@/types';
import { useTaskCard } from '../hooks/useTaskCard';
import { getTaskCardStyles, getTaskCardClasses } from '../utils/taskCardStyles';
import TaskCardHeader from './TaskCardHeader';
import TaskCardContent from './TaskCardContent';

/**
 * TaskCard component
 *
 * Displays a task with expandable details and provides interactions for
 * viewing, pinning, and managing task data.
 *
 * @param task - The task data to display
 */
interface TaskCardProps {
  task: Task;
}

// Custom equality function for TaskCard props
const arePropsEqual = (
  prevProps: TaskCardProps,
  nextProps: TaskCardProps
): boolean => {
  const prevTask = prevProps.task;
  const nextTask = nextProps.task;

  // Perform a shallow comparison of task properties that affect rendering
  return (
    prevTask.id === nextTask.id &&
    prevTask.title === nextTask.title &&
    prevTask.description === nextTask.description &&
    prevTask.due_date === nextTask.due_date &&
    prevTask.url_link === nextTask.url_link &&
    prevTask.pinned === nextTask.pinned &&
    prevTask.status === nextTask.status &&
    prevTask.photo_url === nextTask.photo_url
  );
};

function TaskCard({ task }: TaskCardProps) {
  const {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
    handleTogglePin,
  } = useTaskCard(task);

  const cardStyles = getTaskCardStyles(task, isExpanded);
  const cardClasses = getTaskCardClasses(isExpanded);

  return (
    <div ref={cardRef} className={cardClasses} style={cardStyles}>
      <TaskCardHeader
        task={task}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        handleTogglePin={handleTogglePin}
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
