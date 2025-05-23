
import { useRef, memo, useCallback } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskAnimation } from "@/features/tasks/hooks/useTaskAnimation";

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
        marginBottom: "12px"
      }}
    >
      <div
        ref={cardRef}
        className={`task-card ${isExpanded ? "expanded-card" : ""} bg-white p-4 border ${
          task.pinned ? "border-primary/40" : "border-gray-200"
        } hover:border-primary/60 transition-all duration-200`}
        data-expanded={isExpanded}
        style={{
          overflowY: "hidden",
          boxSizing: "border-box",
          width: "100%",
          position: "relative",
          zIndex: 1,
          borderRadius: "var(--border-radius-xl)",
          boxShadow: isExpanded 
            ? "0 4px 12px rgba(0,0,0,0.08)" 
            : "0 2px 4px rgba(0,0,0,0.04)",
          background: task.pinned 
            ? "linear-gradient(to right, rgba(54, 98, 227, 0.03), rgba(255, 255, 255, 1) 5%)" 
            : "white"
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
