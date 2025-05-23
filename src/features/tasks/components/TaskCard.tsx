
import { useRef, memo, useCallback } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskAnimation } from "@/features/tasks/hooks/useTaskAnimation";
import { useBorderRadius } from "@/contexts/BorderRadiusContext";

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
  const { expandedTaskId, setExpandedTaskId, toggleTaskPin } = useTaskContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const borderStyles = useBorderRadius();
  
  const isExpanded = expandedTaskId === task.id;
  
  // Custom hook for task animations
  const { animationState } = useTaskAnimation(contentRef, isExpanded);

  // Memoize event handlers with useCallback
  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [isExpanded, task.id, setExpandedTaskId]);

  const handleTogglePin = useCallback(async () => {
    await toggleTaskPin(task);
  }, [task, toggleTaskPin]);

  // Direct style with specific border-radius properties
  const cardStyle = {
    overflowY: "hidden" as const,
    boxSizing: "border-box" as const,
    width: "100%",
    position: "relative" as const,
    zIndex: 1,
    borderRadius: "0.75rem",
    WebkitBorderRadius: "0.75rem",
    MozBorderRadius: "0.75rem",
    borderTopLeftRadius: "0.75rem",
    borderTopRightRadius: "0.75rem",
    borderBottomLeftRadius: "0.75rem",
    borderBottomRightRadius: "0.75rem",
    borderWidth: "1px"
  };

  return (
    <div
      className="task-card-container"
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
        style={cardStyle}
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
