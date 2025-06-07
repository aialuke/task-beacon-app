
import { memo } from "react";
import { TaskErrorBoundary } from "./TaskErrorBoundary";
import TaskCardHeader from "./TaskCardHeader";
import TaskCardContent from "./TaskCardContent";
import { useTaskCard } from "../hooks/useTaskCard";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
}

const arePropsEqual = (
  prevProps: TaskCardProps,
  nextProps: TaskCardProps
): boolean => {
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
    animationPhase,
    animationState,
    toggleExpand,
  } = useTaskCard(task);

  // Dynamic classes
  const statusClass = `status-${task.status.toLowerCase()}`;
  const animationClass =
    animationPhase === "enter"
      ? "animate-fade-in"
      : animationPhase === "exit"
      ? "animate-fade-out"
      : "";
  const expandedClass = isExpanded ? "scale-102 shadow-expanded z-10" : "";
  
  // Status-based styles
  const statusStyles: React.CSSProperties = {
    opacity: task.status === "complete" ? 0.8 : 1,
  };

  return (
    <TaskErrorBoundary
      fallback={
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">
            Failed to load task: {task.title}
          </p>
        </div>
      }
    >
      <article
        ref={cardRef}
        className={`bg-card text-card-foreground border border-border shadow-task-card transition-all duration-200 hover:shadow-md cursor-pointer mb-4 w-full max-w-3xl mx-auto rounded-xl p-4 box-border ${statusClass} ${animationClass} ${expandedClass} ${
          task.status === "complete"
            ? "bg-muted"
            : task.status === "overdue"
            ? "border-destructive"
            : ""
        }`}
        style={statusStyles}
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

TaskCard.displayName = "TaskCard";
export default memo(TaskCard, arePropsEqual);
