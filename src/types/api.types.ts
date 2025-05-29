import { Task, TaskStatus, User } from './shared.types';

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
  name: string;
  code?: string;
  details?: unknown;
  hint?: string;
  originalError?: any;
}

export interface TablesResponse<T> {
  data: T | null;
  error: ApiError | null;
}

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

// Table types for Supabase integration
export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  photo_url: string | null;
  url_link: string | null;
  owner_id: string;
  parent_task_id: string | null;
  pinned: boolean;
  status: 'pending' | 'complete' | 'overdue';
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}
