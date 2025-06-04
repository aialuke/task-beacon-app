
/**
 * Shared Types - Legacy Compatibility Layer
 * 
 * This file maintains backward compatibility while redirecting to the new type organization.
 * @deprecated Use specific imports from organized type directories instead
 */

// Re-export from organized type system for backward compatibility
export type {
  Task,
  TaskStatus,
  TaskFilter,
  ParentTask,
  User,
} from './feature-types';

export type {
  UserRole,
} from './feature-types/user.types';

// Legacy exports - these should be migrated to use the organized imports
export type { TaskStatus as LegacyTaskStatus } from './feature-types/task.types';
export type { UserRole as LegacyUserRole } from './feature-types/user.types';
export type { TaskFilter as LegacyTaskFilter } from './feature-types/task.types';
