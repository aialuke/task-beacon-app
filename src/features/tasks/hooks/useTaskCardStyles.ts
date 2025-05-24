
import { useMemo } from "react";
import { Task } from "@/lib/types";
import { getTaskStatus } from "@/lib/uiUtils";
import {
  getTaskCardStatusStyles,
  getTaskCardPinnedStyles,
  getTaskCardExpandedStyles,
  getTaskCardBaseClasses,
  TaskCardStyles
} from "@/lib/taskCardUtils";

/**
 * Custom hook for TaskCard styling
 * 
 * Provides computed styles and CSS classes for task cards based on their state
 * 
 * @param task - The task data
 * @param isExpanded - Whether the task card is expanded
 * @returns Object containing computed styles and CSS classes
 */
export function useTaskCardStyles(task: Task, isExpanded: boolean) {
  const status = getTaskStatus(task);

  // Memoize the computed styles to avoid unnecessary recalculations
  const cardStyles = useMemo((): TaskCardStyles => {
    const statusStyles = getTaskCardStatusStyles(status);
    const pinnedStyles = getTaskCardPinnedStyles(task.pinned);
    const expandedStyles = getTaskCardExpandedStyles(isExpanded);

    // Combine all styles with proper precedence
    return {
      ...statusStyles,
      ...pinnedStyles,
      ...expandedStyles,
    };
  }, [status, task.pinned, isExpanded]);

  // Memoize CSS classes
  const cardClasses = useMemo(() => 
    getTaskCardBaseClasses(isExpanded),
    [isExpanded]
  );

  return {
    cardStyles,
    cardClasses,
    status
  };
}
