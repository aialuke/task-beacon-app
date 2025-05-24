
import { useRef, useCallback } from "react";
import { Task } from "@/lib/types";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useTaskCardAnimation } from "@/features/tasks/hooks/useTaskCardAnimation";
import { useTaskMutation } from "./mutations/useTaskMutation";

/**
 * Custom hook for TaskCard functionality
 * 
 * Provides task card state management, expansion handling, and pin toggling functionality
 * 
 * @param task - The task data to display in the card
 * @returns Object containing refs, state, and handlers for the TaskCard component
 */
export function useTaskCard(task: Task) {
  const { toggleTaskPin } = useTaskMutation();
  const { expandedTaskId, setExpandedTaskId } = useTaskUIContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isExpanded = expandedTaskId === task.id;
  
  // Custom hook for task animations
  const { animationState } = useTaskCardAnimation(contentRef, isExpanded);

  /**
   * Toggle the expanded state of the task card
   */
  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [isExpanded, task.id, setExpandedTaskId]);

  /**
   * Toggle the pinned state of the task
   */
  const handleTogglePin = useCallback(async () => {
    await toggleTaskPin(task);
  }, [task, toggleTaskPin]);

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
    handleTogglePin
  };
}
