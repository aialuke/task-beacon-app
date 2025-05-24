
import { memo } from "react";
import { Task } from "@/lib/types";
import { Suspense } from "react";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskCard } from "../hooks/useTaskCard";
import { useTaskCardStyles } from "../hooks/useTaskCardStyles";
import { Skeleton } from "@/components/ui/skeleton";

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
const arePropsEqual = (prevProps: TaskCardProps, nextProps: TaskCardProps): boolean => {
  const prevTask = prevProps.task;
  const nextTask = nextProps.task;
  
  // Perform a shallow comparison of task properties that affect rendering
  return prevTask.id === nextTask.id &&
         prevTask.title === nextTask.title &&
         prevTask.description === nextTask.description &&
         prevTask.due_date === nextTask.due_date &&
         prevTask.url_link === nextTask.url_link &&
         prevTask.pinned === nextTask.pinned &&
         prevTask.status === nextTask.status &&
         prevTask.photo_url === nextTask.photo_url;
};

function TaskCard({ task }: TaskCardProps) {
  const {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
    handleTogglePin
  } = useTaskCard(task);

  const { cardStyles, cardClasses } = useTaskCardStyles(task, isExpanded);

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={cardStyles}
    >
      <TaskHeader
        task={task}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        handleTogglePin={handleTogglePin}
      />
      
      <TaskDetails
        task={task}
        isExpanded={isExpanded}
        animationState={animationState}
        contentRef={contentRef}
      />
    </div>
  );
}

export default memo(TaskCard, arePropsEqual);
