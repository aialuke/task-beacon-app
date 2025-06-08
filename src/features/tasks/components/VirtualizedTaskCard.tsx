
import { memo, forwardRef } from "react";
import { Task } from "@/types";
import { useTaskCard } from "../hooks/useTaskCard";
import { useTaskCardOptimization } from "../hooks/useTaskCardOptimization";
import { TaskErrorBoundary } from "./TaskErrorBoundary";
import TaskCardHeader from "./TaskCardHeader";
import TaskCardContent from "./TaskCardContent";

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

      const {
        taskMetadata,
        accessibilityProps,
        optimizedHandlers,
        keyboardHandlers,
      } = useTaskCardOptimization(task, {
        enableVirtualization: true,
        prefetchImages: true,
        enableAccessibility: true,
      });

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
        ...optimizedHandlers,
        ...keyboardHandlers,
        ...accessibilityProps,
        "data-index": index,
        "data-task-id": task.id,
      };

      return (
        <TaskErrorBoundary
          fallback={
            <div
              style={style}
              className="p-4 rounded-xl border border-destructive/20 bg-destructive/5"
            >
              <p className="text-sm text-destructive">
                Failed to load task: {task.title}
              </p>
            </div>
          }
        >
          <article
            ref={ref ?? cardRef}
            className={`virtualized-task-card bg-card text-card-foreground border border-border shadow-task-card transition-all duration-200 hover:shadow-md cursor-pointer mb-4 w-full rounded-xl p-4 box-border max-w-full ${statusClass} ${animationClass} ${expandedClass} ${
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
        </TaskErrorBoundary>
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
// CodeRabbit review
