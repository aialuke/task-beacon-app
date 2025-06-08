
import { useCallback, useMemo } from "react";
import type { Task } from "@/types";

interface TaskCardOptimizationOptions {
  enableVirtualization?: boolean;
  prefetchImages?: boolean;
  enableAccessibility?: boolean;
}

/**
 * Task Card Optimization Hook - Simplified Implementation
 * 
 * Simplified to use standard React patterns instead of over-optimization.
 * Focuses on actual performance benefits while maintaining functionality.
 */
export function useTaskCardOptimization(
  task: Task,
  options: TaskCardOptimizationOptions = {}
) {
  const {
    enableVirtualization = true,
    prefetchImages = true,
    enableAccessibility = true,
  } = options;

  // Simplified task data extraction using standard useMemo
  const taskMetadata = useMemo(
    () => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.due_date,
      hasPhoto: !!task.photo_url,
      hasUrl: !!task.url_link,
      hasDescription: !!task.description,
      isOverdue: task.status === "overdue",
      isPending: task.status === "pending",
      isComplete: task.status === "complete",
    }),
    [
      task.id,
      task.title,
      task.status,
      task.due_date,
      task.photo_url,
      task.url_link,
      task.description,
    ]
  );

  // Accessibility attributes using standard useMemo
  const accessibilityProps = useMemo(
    () => {
      if (!enableAccessibility) return {};

      const statusText = taskMetadata.isComplete
        ? "completed"
        : taskMetadata.isOverdue
        ? "overdue"
        : "pending";

      return {
        role: "article" as const,
        "aria-label": `Task: ${task.title}, Status: ${statusText}`,
        "aria-describedby": `task-${task.id}-description`,
        "aria-live": (taskMetadata.isOverdue ? "assertive" : "polite") as
          | "assertive"
          | "polite"
          | "off",
        tabIndex: 0,
      };
    },
    [taskMetadata, task.id, task.title, enableAccessibility]
  );

  // Image prefetching using standard useCallback
  const prefetchImage = useCallback(
    () => {
      if (!prefetchImages || !task.photo_url) return;

      const img = new Image();
      img.src = task.photo_url;
    },
    [task.photo_url, prefetchImages]
  );

  // Memory-efficient event handlers using standard useMemo
  const optimizedHandlers = useMemo(
    () => ({
      onFocus: () => {
        if (prefetchImages && task.photo_url) {
          prefetchImage();
        }
      },
      onMouseEnter: () => {
        if (prefetchImages && task.photo_url) {
          prefetchImage();
        }
      },
    }),
    [prefetchImage, prefetchImages, task.photo_url]
  );

  // Keyboard navigation using standard useMemo
  const keyboardHandlers = useMemo(
    () => {
      if (!enableAccessibility) return {};

      return {
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const firstButton = event.currentTarget.querySelector("button");
            firstButton?.focus();
          }
        },
      };
    },
    [enableAccessibility]
  );

  return {
    taskMetadata,
    accessibilityProps,
    optimizedHandlers,
    keyboardHandlers,
    prefetchImage,
  };
}
