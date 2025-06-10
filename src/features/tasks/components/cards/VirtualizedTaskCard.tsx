
import { memo, forwardRef } from "react";

import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { Task } from "@/types";

import { useTaskCard } from "../../hooks/useTaskCard";

import TaskCardContent from "./TaskCardContent";
import TaskCardHeader from "./TaskCardHeader";

interface VirtualizedTaskCardProps {
  task: Task;
  style?: React.CSSProperties;
  index: number;
}

const VirtualizedTaskCard = memo(
  forwardRef<HTMLDivElement, VirtualizedTaskCardProps>(
    ({ task, style, index }, ref) => {
      const {
        contentRef,
        cardRef,
        isExpanded,
        animationPhase,
        animationState,
        toggleExpand,
      } = useTaskCard(task);

      // Simple optimization props (replacing the deleted hook)
      const accessibilityProps = {
        role: "article",
        "aria-label": `Task: ${task.title}`,
        tabIndex: 0,
      };

      const keyboardHandlers = {
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpand();
          }
        },
      };

      const statusClass = `status-${task.status.toLowerCase()}`;
      const animationClass =
        animationPhase === "enter"
          ? "animate-fade-in"
          : animationPhase === "exit"
          ? "animate-fade-out"
          : "";
      const expandedClass = isExpanded ? "scale-102 shadow-expanded z-10" : "";
      const statusStyles: React.CSSProperties = {
        opacity: task.status === "complete" ? 0.8 : 1,
      };

      const combinedStyles = {
        ...statusStyles,
        ...style,
        position: "absolute" as const,
        width: "100%",
        transform: style?.transform ?? "none",
      };

      const combinedProps = {
        ...keyboardHandlers,
        ...accessibilityProps,
        "data-index": index,
        "data-task-id": task.id,
        onClick: toggleExpand,
      };

      return (
        <UnifiedErrorBoundary variant="inline"
          fallback={
            <div
              style={style}
              className="border-destructive/20 bg-destructive/5 rounded-xl border p-4"
            >
              <p className="text-destructive text-sm">
                Failed to load task: {task.title}
              </p>
            </div>
          }
        >
          <article
            ref={ref ?? cardRef}
            className={`virtualized-task-card bg-card text-card-foreground border-border shadow-task-card mb-4 box-border w-full max-w-full cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${statusClass} ${animationClass} ${expandedClass} ${
              task.status === "complete"
                ? "bg-muted"
                : task.status === "overdue"
                ? "!border-destructive"
                : ""
            }`}
            style={combinedStyles}
            {...combinedProps}
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
  )
);

VirtualizedTaskCard.displayName = "VirtualizedTaskCard";

const arePropsEqual = (
  prevProps: VirtualizedTaskCardProps,
  nextProps: VirtualizedTaskCardProps
): boolean => {
  const prev = prevProps.task;
  const next = nextProps.task;
  const styleChanged =
    JSON.stringify(prevProps.style) !== JSON.stringify(nextProps.style);
  const indexChanged = prevProps.index !== nextProps.index;

  return (
    !styleChanged &&
    !indexChanged &&
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

export default memo(VirtualizedTaskCard, arePropsEqual);
