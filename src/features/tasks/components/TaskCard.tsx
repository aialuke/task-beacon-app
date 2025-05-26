
import { memo } from "react";
import { Task } from "@/types";
import { Suspense } from "react";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskCard } from "../hooks/useTaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskStatus } from "@/lib/uiUtils";

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

  const status = getTaskStatus(task);

  // Get status-specific styles
  const getStatusStyles = () => {
    const baseStyles = {
      borderWidth: '2px',
      borderStyle: 'solid',
    };

    switch (status) {
      case 'complete':
        return {
          ...baseStyles,
          borderColor: 'hsl(var(--success))',
          backgroundColor: 'hsl(var(--card))',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        };
      case 'overdue':
        return {
          ...baseStyles,
          borderColor: 'hsl(var(--destructive))',
          backgroundColor: 'hsl(var(--card))',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        };
      case 'pending':
        return {
          ...baseStyles,
          borderColor: 'hsl(var(--accent-yellow))',
          backgroundColor: 'hsl(var(--card))',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        };
      default:
        return {
          ...baseStyles,
          borderColor: 'hsl(var(--border))',
          backgroundColor: 'hsl(var(--card))',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        };
    }
  };

  // Get pinned styles if task is pinned
  const getPinnedStyles = () => {
    if (!task.pinned) return {};
    return {
      borderColor: 'hsl(var(--primary))',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 2px hsl(var(--primary) / 0.2)',
    };
  };

  // Get expanded styles if expanded
  const getExpandedStyles = () => {
    if (!isExpanded) return {};
    return {
      borderColor: 'hsl(var(--primary))',
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 0 2px hsl(var(--primary) / 0.3)',
      zIndex: 20,
    };
  };

  // Combine all styles
  const cardStyles = {
    ...getStatusStyles(),
    ...getPinnedStyles(),
    ...getExpandedStyles(),
  };

  // Build Tailwind classes (without border styles since we're using inline)
  const cardClasses = [
    "flex flex-col p-4 sm:p-5 transition-all duration-300 relative text-left rounded-xl",
    "min-h-[75px] w-full cursor-pointer overflow-hidden",
    "hover:scale-[1.01] hover:-translate-y-0.5",
    isExpanded && "z-20",
  ].filter(Boolean).join(" ");

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
