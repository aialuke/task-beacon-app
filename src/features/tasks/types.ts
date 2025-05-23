
import { Task, TaskStatus } from "@/lib/types";

// Re-export specialized type modules for easier imports
export * from './types/task-api.types';
export * from './types/task-ui.types';

// Types
export type TaskFilter = TaskStatus | "all" | "assigned";

// Legacy type kept for backward compatibility
// New code should use specific context types from TaskContext.tsx and TaskUIContext.tsx
export interface TaskContextType {
  // Task queries
  tasks: Task[];
  isLoading: boolean;
  isFetching?: boolean;
  error: Error | null;
  
  // Filters
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  
  // Expanded state
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  
  // Task mutations
  toggleTaskPin: (task: Task) => Promise<void>;
  toggleTaskComplete: (task: Task) => Promise<void>;
  createFollowUpTask: (parentTask: Task, newTaskData: any) => Promise<void>;
  
  // Pagination
  currentPage?: number;
  totalCount?: number;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  goToNextPage?: () => void;
  goToPreviousPage?: () => void;
}
