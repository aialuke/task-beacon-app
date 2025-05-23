
import { useRef, memo, useCallback } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskAnimation } from "@/features/tasks/hooks/useTaskAnimation";
import { Card } from "@/components/ui/card";

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

  // Determine which gradient to use based on task status
  const getCardGradient = () => {
    if (task.status === "complete") {
      return "bg-gradient-to-br from-white to-green-50";
    } else if (task.status === "overdue") {
      return "bg-gradient-to-br from-white to-red-50";
    }
    return "bg-gradient-to-br from-white to-blue-50";
  };

  return (
    <div
      className={`task-card-container ${isExpanded ? "expanded" : ""} mb-4`}
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
      <Card
        ref={cardRef}
        className={`modern-task-card ${getCardGradient()} ${isExpanded ? "expanded-card" : ""} p-4 sm:p-5 hover:shadow-lg transition-all duration-300 border-t-4 ${
          task.pinned ? "border-t-primary" : "border-t-gray-200"
        }`}
        data-expanded={isExpanded}
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
      </Card>
    </div>
  );
}

export default memo(TaskCard, arePropsEqual);
