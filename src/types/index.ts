
// Central export for all shared types
// Consolidated to reduce import complexity and improve tree-shaking

// Core shared types (most commonly used)
export type { Task, TaskStatus, TaskFilter, User, ParentTask } from './shared.types';

// Form types
export type { FormState, UseFormStateOptions } from './form.types';

// API types (commonly used in hooks and services)
export type { 
  ApiResponse, 
  ApiError, 
  TaskCreateParams, 
  TaskUpdateParams,
  TaskActionResult 
} from './api.types';

// Re-export all for backward compatibility but encourage direct imports
export * from './shared.types';
export * from './form.types';
export * from './api.types';
