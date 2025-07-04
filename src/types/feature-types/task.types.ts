/**
 * Task Feature Types
 *
 * Task-specific types and interfaces for the task management feature.
 */

// Import from unified type system instead of deleted common.types
import type { ID, Timestamp, Status } from '../utility.types';

// Task filter union type (not interface)
export type TaskFilter =
  | 'all'
  | 'pending'
  | 'complete'
  | 'overdue'
  | 'assigned';

// Main task interfaces
interface TaskFilterOptions {
  status?: 'pending' | 'complete' | 'overdue' | 'all';
  search?: string;
  assignee?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  hasParent?: boolean;
  parentId?: string;
}

interface ParentTask {
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
  url_link?: string;
  photo_url?: string;
}

export interface TaskUpdateData extends Partial<TaskCreateData> {
  id: string;
  status?: 'pending' | 'complete' | 'overdue';
}

// Query and filtering options
interface TaskQueryOptions {
  page?: number;
  pageSize?: number;
  filters?: TaskFilterOptions;
  sortBy?: 'due_date' | 'created_at' | 'title' | 'status';
  sortDirection?: 'asc' | 'desc';
  includeCompleted?: boolean;
}

// Task workflow and status management
interface TaskWorkflowStatus {
  canEdit: boolean;
  canDelete: boolean;
  canComplete: boolean;
  canReopen: boolean;
  canAssign: boolean;
  canCreateFollowUp: boolean;
}

// Task analytics and metrics
interface TaskMetrics {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime?: number;
}

// Task relationship types
interface TaskRelationship {
  parentId?: string;
  childIds: string[];
  siblingIds: string[];
  depth: number;
}

// Additional types for compatibility
interface TaskSearchFilters {
  search?: string;
  status?: TaskFilter;
  assignee?: string;
}

interface TaskListResponse {
  data: unknown[];
  total: number;
  page: number;
  pageSize: number;
}

// Export convenience type aliases
type TaskId = ID;
type TaskTimestamp = Timestamp;
type TaskStatus = Status;
