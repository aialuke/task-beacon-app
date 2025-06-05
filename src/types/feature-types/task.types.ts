
/**
 * Task Feature Types
 * 
 * Task-specific types and interfaces for the task management feature.
 */

// Import from unified type system instead of deleted common.types
import type { ID, Timestamp, Status } from '../utility.types';

// Main task interfaces
export interface TaskFilter {
  status?: 'pending' | 'complete' | 'overdue' | 'all';
  search?: string;
  assignee?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  priority?: TaskPriority;
  hasParent?: boolean;
  parentId?: string;
}

export interface TaskPriority {
  level: 'low' | 'medium' | 'high';
  value: number;
}

export interface ParentTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'complete' | 'overdue';
  due_date?: string;
}

// Task creation and update data
export interface TaskCreateData {
  title: string;
  description?: string;
  due_date?: string;
  assignee_id?: string;
  parent_task_id?: string;
  priority?: TaskPriority;
  url_link?: string;
  photo_url?: string;
}

export interface TaskUpdateData extends Partial<TaskCreateData> {
  id: string;
  status?: 'pending' | 'complete' | 'overdue';
  pinned?: boolean;
}

// Query and filtering options
export interface TaskQueryOptions {
  page?: number;
  pageSize?: number;
  filters?: TaskFilter;
  sortBy?: 'due_date' | 'created_at' | 'title' | 'status';
  sortDirection?: 'asc' | 'desc';
  includeCompleted?: boolean;
}

// Task workflow and status management
export interface TaskWorkflowStatus {
  canEdit: boolean;
  canDelete: boolean;
  canComplete: boolean;
  canReopen: boolean;
  canAssign: boolean;
  canCreateFollowUp: boolean;
}

// Task analytics and metrics
export interface TaskMetrics {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime?: number;
}

// Task relationship types
export interface TaskRelationship {
  parentId?: string;
  childIds: string[];
  siblingIds: string[];
  depth: number;
}

// Export convenience type aliases
export type TaskId = ID;
export type TaskTimestamp = Timestamp;
export type TaskStatus = Status;
