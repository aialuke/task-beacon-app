
/**
 * Feature Types Barrel - Simplified
 * 
 * Clean exports for domain-specific types without overwhelming the developer.
 */

// Task domain types (most commonly used)
export type {
  TaskFilter,
  TaskFilterOptions,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
} from './task.types';

// User domain types (essential only)
export type {
  UserPreferences,
  NotificationPreferences,
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
} from './user.types';
