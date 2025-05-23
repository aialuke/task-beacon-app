
import { Task, TaskStatus, User } from "@/lib/types";

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
  createFollowUpTask: (parentTask: Task, newTaskData: TaskFormData) => Promise<void>;
  
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

// Form data types
export interface BaseTaskFormData {
  title: string;
  description: string | null;
  due_date: string | null;
  photo_url: string | null;
  url_link: string | null;
  pinned: boolean;
  assignee_id: string | null;
}

export interface NewTaskFormData extends BaseTaskFormData {
  // Specific fields for new tasks
  parent_task_id?: null;
}

export interface FollowUpTaskFormData extends BaseTaskFormData {
  // Follow-up tasks must have a parent
  parent_task_id: string;
}

export type TaskFormData = NewTaskFormData | FollowUpTaskFormData;

// Form state types for hooks
export interface TaskFormState {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  photo: File | null;
  photoPreview: string | null;
  pinned: boolean;
  assigneeId: string;
  loading: boolean;
}

// Response types for API calls
export interface TaskApiResponse {
  data: Task | null;
  error: Error | null;
}

export interface TaskListApiResponse {
  data: Task[] | null;
  error: Error | null;
  count?: number;
}

// Type guard to check if a task form data is follow-up
export function isFollowUpTaskFormData(data: TaskFormData): data is FollowUpTaskFormData {
  return 'parent_task_id' in data && data.parent_task_id !== null;
}
