/**
 * Task Feature Types Barrel File
 * 
 * Exports all task feature-specific types including components, hooks, 
 * contexts, and UI patterns. These are separate from core task domain types.
 */

// Component types
export type * from './task-ui.types';
export type * from './task-form.types';

// API types (feature-specific)
export type * from './task-api.types';

// Additional component prop types
export interface TaskListComponentProps {
  className?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  emptyMessage?: string;
  onTaskSelect?: (task: import('@/types').Task) => void;
}

export interface TaskFormComponentProps {
  initialValues?: Partial<import('@/types').TaskCreateData>;
  onSubmit: (data: import('@/types').TaskCreateData) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export interface TaskDetailsComponentProps {
  taskId: string;
  isEditable?: boolean;
  onUpdate?: (data: import('@/types').TaskUpdateData) => void;
  onDelete?: () => void;
}

// Hook types specific to task features
export interface UseTaskListOptions {
  status?: import('@/types').TaskFilter;
  assignedToMe?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UseTaskMutationsReturn {
  createTask: (data: import('@/types').TaskCreateData) => Promise<void>;
  updateTask: (id: string, data: import('@/types').TaskUpdateData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Context types for task features
export interface TaskDialogContextType {
  isOpen: boolean;
  dialogType: 'create' | 'edit' | 'followUp' | null;
  taskId: string | null;
  openDialog: (type: 'create' | 'edit' | 'followUp', taskId?: string) => void;
  closeDialog: () => void;
}

// Re-export existing types for convenience
export type { TaskUIContextType, TaskDialogState } from './task-ui.types';
export type { TaskFormData, TaskFormOptions } from './task-form.types'; 