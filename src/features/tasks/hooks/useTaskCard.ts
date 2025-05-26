
import { useRef, useCallback, useMemo } from "react";
import { Task } from "@/types";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useTaskAnimation } from "@/features/tasks/hooks/useTaskAnimation";
import { useTaskMutations } from "./useTaskMutations";

/**
 * Custom hook for TaskCard functionality
 * 
 * Provides task card state management, expansion handling, and pin toggling functionality
 * 
 * @param task - The task data to display in the card
 * @returns Object containing refs, state, and handlers for the TaskCard component
 */
export function useTaskCard(task: Task) {
  const { toggleTaskPin } = useTaskMutations();
  const { expandedTaskId, setExpandedTaskId } = useTaskUIContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Memoize expansion state to prevent unnecessary recalculations
  const isExpanded = useMemo(() => 
    expandedTaskId === task.id, 
    [expandedTaskId, task.id]
  );
  
  // Custom hook for task animations
  const { animationState } = useTaskAnimation(contentRef, isExpanded);

  /**
   * Toggle the expanded state of the task card
   * Optimized: Only recreate when necessary dependencies change
   */
  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [setExpandedTaskId, isExpanded, task.id]);

  /**
   * Toggle the pinned state of the task
   * Optimized: Only recreate when task.id or task.pinned changes
   */
  const handleTogglePin = useCallback(async () => {
    await toggleTaskPin(task);
  }, [toggleTaskPin, task.id, task.pinned]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand,
    handleTogglePin
  }), [isExpanded, animationState, toggleExpand, handleTogglePin]);
}
