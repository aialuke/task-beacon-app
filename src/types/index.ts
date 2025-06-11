/**
 * Types Index - Domain-Specific Organization
 *
 * Streamlined index that imports from domain-specific type files.
 * This provides better tree-shaking and clearer type organization.
 */

// === DATABASE TYPES ===
export type {
  TaskWithRelations as Task,
  ProfileTable as User,
  TaskWithRelations,
  TaskStatusEnum as TaskStatus,
  UserRoleEnum as UserRole,
} from './database';

// === DOMAIN-SPECIFIC TYPE EXPORTS ===

// Authentication types
export type { AuthUser, Session, AuthResponse } from './auth.types';

// API types
export type { ApiResponse, ApiError, ServiceResult } from './api.types';

// UI component types;

// Form types;

// Pagination types;

// Async state types;

// Feature-specific types
export type {
  TaskFilter,
  TaskCreateData,
  TaskUpdateData,
  UserQueryOptions,
} from './feature-types';

// Utility types
export type { ID, Timestamp } from './utility.types';
