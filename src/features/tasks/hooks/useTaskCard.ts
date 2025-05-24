
import { useRef } from "react";
import { Task } from "@/lib/types";

/**
 * Simplified hook for TaskCard functionality
 * 
 * Only handles card-specific refs and state, contexts are used directly in components
 * 
 * @param task - The task data to display in the card
 * @returns Object containing refs for the TaskCard component
 */
export function useTaskCard(task: Task) {
  console.log("[useTaskCard] Hook called for task:", task.id);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  console.log("[useTaskCard] Returning refs");
  
  return {
    contentRef,
    cardRef
  };
}
