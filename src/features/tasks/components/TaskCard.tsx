
import { memo } from "react";
import { Task } from "@/lib/types";
import { Suspense } from "react";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskCard } from "../hooks/useTaskCard";
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

  return (
    <div
      className={`task-card-container ${isExpanded ? "expanded" : ""}`}
      style={{
        overflowY: "hidden",
        boxSizing: "border-box",
        width: "100%",
        position: "relative",
        zIndex: 1,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        ref={cardRef}
        className={`task-card ${isExpanded ? "expanded-card" : ""} p-3 border border-gray-200 hover:border-secondary`}
        data-expanded={isExpanded}
        style={{
          overflowY: "hidden",
          boxSizing: "border-box",
          width: "100%",
          position: "relative",
          zIndex: 1,
          borderRadius: "var(--radius-xl)"
        }}
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
    </div>
  );
}

export default memo(TaskCard, arePropsEqual);
