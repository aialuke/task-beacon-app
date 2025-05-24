
import { Task, TaskStatus } from "@/lib/types";
import { getTaskStatus } from "@/lib/uiUtils";

/**
 * Task card styling utilities
 */

export interface TaskCardStyles {
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  backgroundColor?: string;
  boxShadow?: string;
  transform?: string;
  zIndex?: number;
}

/**
 * Get status-specific styles for task cards
 */
export function getTaskCardStatusStyles(status: TaskStatus): TaskCardStyles {
  const baseStyles = {
    borderWidth: '2px',
    borderStyle: 'solid',
  };

  switch (status) {
    case 'complete':
      return {
        ...baseStyles,
        borderColor: 'hsl(var(--success))',
        backgroundColor: 'hsl(var(--card))',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      };
    case 'overdue':
      return {
        ...baseStyles,
        borderColor: 'hsl(var(--destructive))',
        backgroundColor: 'hsl(var(--card))',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      };
    case 'pending':
      return {
        ...baseStyles,
        borderColor: 'hsl(var(--accent-yellow))',
        backgroundColor: 'hsl(var(--card))',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      };
    default:
      return {
        ...baseStyles,
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--card))',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      };
  }
}

/**
 * Get pinned styles for task cards
 */
export function getTaskCardPinnedStyles(isPinned: boolean): Partial<TaskCardStyles> {
  if (!isPinned) return {};
  
  return {
    borderColor: 'hsl(var(--primary))',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 2px hsl(var(--primary) / 0.2)',
  };
}

/**
 * Get expanded styles for task cards
 */
export function getTaskCardExpandedStyles(isExpanded: boolean): Partial<TaskCardStyles> {
  if (!isExpanded) return {};
  
  return {
    borderColor: 'hsl(var(--primary))',
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 0 2px hsl(var(--primary) / 0.3)',
    zIndex: 20,
  };
}

/**
 * Get base CSS classes for task cards
 */
export function getTaskCardBaseClasses(isExpanded: boolean): string {
  return [
    "flex flex-col p-4 sm:p-5 transition-all duration-300 relative text-left rounded-xl",
    "min-h-[75px] w-full cursor-pointer overflow-hidden",
    "hover:scale-[1.01] hover:-translate-y-0.5",
    isExpanded && "z-20",
  ].filter(Boolean).join(" ");
}
