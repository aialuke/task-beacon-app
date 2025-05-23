
import { Task, TaskStatus } from "@/lib/types";

// Types
export type TaskFilter = TaskStatus | "all" | "assigned";

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
