import { useRef, memo } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";
import { useTaskAnimation } from "@/features/tasks/hooks/useTaskAnimation";

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { expandedTaskId, setExpandedTaskId, toggleTaskPin } = useTaskContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isExpanded = expandedTaskId === task.id;
  
  // Custom hook for task animations
  const { animationState } = useTaskAnimation(contentRef, isExpanded);

  const toggleExpand = () => {
    setExpandedTaskId(isExpanded ? null : task.id);
  };

  const handleTogglePin = async () => {
    await toggleTaskPin(task);
  };

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
          borderRadius: "var(--border-radius-xl)"
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

export default memo(TaskCard);
