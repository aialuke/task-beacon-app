
import { Task, TaskStatus } from "@/lib/types";

/**
 * API response types for task operations
 */

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface TaskCreateParams {
  title: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  parentTaskId?: string | null;
  pinned?: boolean;
}

export interface TaskUpdateParams {
  title?: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string | null;
  urlLink?: string | null;
  assigneeId?: string | null;
  pinned?: boolean;
  status?: TaskStatus;
}

export interface TaskQueryParams {
  status?: TaskStatus | 'all'; 
  assignedToMe?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'dueDate' | 'createdAt' | 'title';
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

export interface TaskError {
  message: string;
  code: string;
  details?: any;
}

export interface TaskActionResult<T = void> {
  data: T | null;
  error: TaskError | null;
  isSuccess: boolean;
}
