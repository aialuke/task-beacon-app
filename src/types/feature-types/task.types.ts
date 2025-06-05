/**
 * Core Task Domain Types
 * 
 * Central task entity definitions and related types used across all task features.
 * These are the core domain models for task management.
 */

import type { BaseEntity, ID, Timestamp } from '../shared/common.types';

// Core task status and filter types
export type TaskStatus = 'pending' | 'complete' | 'overdue';
export type TaskFilter = TaskStatus | 'all' | 'assigned';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Parent task interface
export interface ParentTask {
  id: ID;
  title: string;
  description: string | null;
  photo_url: string | null;
  url_link: string | null;
}

// Core task entity
export interface Task extends BaseEntity {
  title: string;
  description: string | null;
  due_date: Timestamp | null;
  photo_url: string | null;
  url_link: string | null;
  owner_id: ID;
  parent_task_id: ID | null;
  parent_task: ParentTask | null;
  status: TaskStatus;
  assignee_id: ID | null;
  priority?: TaskPriority;
  tags?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage?: number;
}

// Task creation and update interfaces
export interface TaskCreateData {
  title: string;
  description?: string;
  due_date?: Timestamp;
  photo_url?: string | null;
  url_link?: string | null;
  assignee_id?: ID | null;
  parent_task_id?: ID | null;
  priority?: TaskPriority;
  tags?: string[];
  estimated_hours?: number;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  due_date?: Timestamp;
  photo_url?: string | null;
  url_link?: string | null;
  assignee_id?: ID | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage?: number;
}

// Task query and search interfaces
export interface TaskQueryOptions {
  status?: TaskFilter;
  assignedToMe?: boolean;
  createdByMe?: boolean;
  priority?: TaskPriority[];
  tags?: string[];
  due_date_from?: Timestamp;
  due_date_to?: Timestamp;
  search?: string;
  parent_task_id?: ID | null;
  include_subtasks?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'due_date' | 'created_at' | 'updated_at' | 'title' | 'priority';
  sortDirection?: 'asc' | 'desc';
}

export interface TaskSearchFilters {
  query?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee_ids?: ID[];
  owner_ids?: ID[];
  tags?: string[];
  created_after?: Timestamp;
  created_before?: Timestamp;
  due_after?: Timestamp;
  due_before?: Timestamp;
  has_attachments?: boolean;
}

// Task list and pagination interfaces
export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: TaskSearchFilters;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Task statistics and analytics
export interface TaskStatistics {
  total: number;
  pending: number;
  complete: number;
  overdue: number;
  assigned_to_me: number;
  created_by_me: number;
  high_priority: number;
  due_today: number;
  due_this_week: number;
  completion_rate: number;
  average_completion_time: number;
}

// Task relationships
export interface TaskRelationship {
  id: ID;
  parent_task_id: ID;
  child_task_id: ID;
  relationship_type: 'subtask' | 'dependency' | 'reference';
  created_at: Timestamp;
}

// Task history and audit
export interface TaskHistoryEntry extends BaseEntity {
  task_id: ID;
  user_id: ID;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'assigned' | 'unassigned';
  field_name?: string;
  old_value?: unknown;
  new_value?: unknown;
  description?: string;
}

// Task comments and collaboration
export interface TaskComment extends BaseEntity {
  task_id: ID;
  user_id: ID;
  content: string;
  parent_comment_id?: ID | null;
  edited_at?: Timestamp | null;
  is_deleted: boolean;
}

// Task attachments
export interface TaskAttachment extends BaseEntity {
  task_id: ID;
  user_id: ID;
  filename: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description?: string;
}

// Task templates
export interface TaskTemplate extends BaseEntity {
  name: string;
  description?: string;
  template_data: TaskCreateData;
  category?: string;
  tags?: string[];
  is_public: boolean;
  created_by: ID;
  usage_count: number;
}

// Task notifications
export interface TaskNotification extends BaseEntity {
  task_id: ID;
  user_id: ID;
  type: 'assignment' | 'due_soon' | 'overdue' | 'comment' | 'completion' | 'update';
  title: string;
  message: string;
  is_read: boolean;
  read_at?: Timestamp | null;
}

// Task bulk operations
export interface TaskBulkOperation {
  action: 'update' | 'delete' | 'assign' | 'complete' | 'duplicate';
  task_ids: ID[];
  data?: Partial<TaskUpdateData>;
  assignee_id?: ID;
}

export interface TaskBulkOperationResult {
  success_count: number;
  error_count: number;
  errors: {
    task_id: ID;
    error: string;
  }[];
}

// Task import/export
export interface TaskExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  include_fields: (keyof Task)[];
  filters?: TaskSearchFilters;
}

export interface TaskImportData {
  tasks: Partial<TaskCreateData>[];
  options: {
    skip_duplicates: boolean;
    update_existing: boolean;
    assign_to_me: boolean;
  };
}

export interface TaskImportResult {
  imported_count: number;
  skipped_count: number;
  error_count: number;
  errors: {
    row: number;
    error: string;
  }[];
}
