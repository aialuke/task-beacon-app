
import { memo } from "react";
import { Task } from "@/lib/types";
import { Suspense } from "react";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskCardAnimation } from "../hooks/useTaskCardAnimation";
import { useTaskCardStyles } from "../hooks/useTaskCardStyles";
import { useTaskUIContext } from "../context/TaskUIContext";
import { useTaskMutation } from "../hooks/useTaskMutation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TaskCard component - Simplified to use contexts directly
 */
interface TaskCardProps {
  task: Task;
}

// Custom equality function for TaskCard props
const arePropsEqual = (prevProps: TaskCardProps, nextProps: TaskCardProps): boolean => {
  const prevTask = prevProps.task;
  const nextTask = nextProps.task;
  
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
  console.log("[TaskCard] Rendering task:", task.id);
  
  // Use contexts directly instead of composite hook
  const { expandedTaskId, setExpandedTaskId } = useTaskUIContext();
  const { toggleTaskPin } = useTaskMutation();
  
  const isExpanded = expandedTaskId === task.id;
  
  // Simple toggle function
  const toggleExpand = () => {
    console.log("[TaskCard] Toggling expand for task:", task.id);
    setExpandedTaskId(isExpanded ? null : task.id);
  };

  // Simple pin toggle function
  const handleTogglePin = async () => {
    console.log("[TaskCard] Toggling pin for task:", task.id);
    await toggleTaskPin(task);
  };

  // Use animation and styles hooks directly
  const animationState = useTaskCardAnimation(null, isExpanded);
  const { cardStyles, cardClasses } = useTaskCardStyles(task, isExpanded);

  return (
    <div
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
        contentRef={null}
      />
    </div>
  );
}

export default memo(TaskCard, arePropsEqual);
