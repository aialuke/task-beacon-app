
import { memo, useEffect, useState } from "react";

import { UnifiedErrorBoundary } from '@/components/ui/UnifiedErrorBoundary';
import { componentLogger } from '@/lib/logger';
import { isElementInViewport } from '@/lib/utils/ui';
import type { Task } from "@/types";

import { useTaskCard } from "../../hooks/useTaskCard";

import TaskCardContent from "./TaskCardContent";
import TaskCardHeader from "./TaskCardHeader";


interface TaskCardProps {
  task: Task;
  style?: React.CSSProperties;
  className?: string;
}

const arePropsEqual = (
  prevProps: TaskCardProps,
  nextProps: TaskCardProps
): boolean => {
  const prev = prevProps.task;
  const next = nextProps.task;
  
  // Primary check: if it's the same task object, no need to re-render
  if (prev === next) return true;
  
  // Check key properties that affect the display
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

function TaskCard({ task, style, className }: TaskCardProps) {
  const {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
    measureRef,
  } = useTaskCard(task);
  
  const [isInViewport, setIsInViewport] = useState(false);
  
  // Log component lifecycle events
  useEffect(() => {
    componentLogger.info('TaskCard mounted', { taskId: task.id, title: task.title });
    
    return () => {
      componentLogger.info('TaskCard unmounted', { taskId: task.id });
    };
  }, [task.id, task.title, cardRef]);
  
  // Check if card is in viewport for performance optimizations
  useEffect(() => {
    if (!cardRef.current) return;
    
    const checkViewport = () => {
      if (cardRef.current) {
        setIsInViewport(isElementInViewport(cardRef.current));
      }
    };
    
    // Initial check
    checkViewport();
    
    // Check on scroll
    const handleScroll = () => checkViewport();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cardRef]);

  // Dynamic classes
  const statusClass = `status-${task.status.toLowerCase()}`;
  const expandedClass = isExpanded ? "scale-102 shadow-expanded z-10" : "";
  const viewportClass = isInViewport ? "opacity-100" : "opacity-50";
  
  // Status-based styles
  const statusStyles: React.CSSProperties = {
    opacity: task.status === "complete" ? 0.8 : 1,
    transition: 'opacity 0.3s ease-in-out',
    ...style,
  };
  
  // Combined status-based classes
  const statusBgClass = task.status === "complete" 
    ? "bg-muted" 
    : task.status === "overdue" 
    ? "border-destructive" 
    : "";

  return (
    <UnifiedErrorBoundary
      variant="inline"
      fallback={
        <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-4">
          <p className="text-destructive text-sm">
            Failed to load task: {task.title}
          </p>
        </div>
      }
    >
      <article
        ref={cardRef}
        className={`bg-card text-card-foreground border-border shadow-task-card mx-auto mb-4 box-border w-full max-w-2xl cursor-pointer rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${statusClass} ${expandedClass} ${statusBgClass} ${viewportClass} ${className || ''}`}
        style={statusStyles}
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
          measureRef={measureRef}
        />
      </article>
    </UnifiedErrorBoundary>
  );
}

TaskCard.displayName = "TaskCard";
export default memo(TaskCard, arePropsEqual);
