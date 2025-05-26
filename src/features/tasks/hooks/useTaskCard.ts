
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
   * Optimized: Only recreate when task.id or setExpandedTaskId changes
   */
  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [task.id, setExpandedTaskId, isExpanded]);

  /**
   * Toggle the pinned state of the task
   * Optimized: Only recreate when task or toggleTaskPin changes
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
