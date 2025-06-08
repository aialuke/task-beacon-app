
/**
 * Schemas Index - Central Export Point
 * 
 * Phase 1: Core Schema Definition - Central exports for all Zod validation schemas
 */

// === CORE VALIDATION SCHEMAS ===
export * from './validation';
export * from './common.schemas';

// === DOMAIN SPECIFIC SCHEMAS ===
export * from './user.schemas';
export * from './task.schemas';

// === LEGACY COMPATIBILITY ===
// Re-export existing schemas for backward compatibility (avoiding conflicts)
export { 
  baseTaskSchema as legacyBaseTaskSchema,
  createTaskSchema as legacyCreateTaskSchema,
  updateTaskSchema as legacyUpdateTaskSchema,
  taskFormSchema as legacyTaskFormSchema,
  VALIDATION_MESSAGES as LEGACY_VALIDATION_MESSAGES
} from '../features/tasks/schemas/taskSchema';

export * from './commonValidation';

// === UTILITY EXPORTS ===
export type {
  PaginationInput,
  SortingInput,
  SearchFormInput,
  FileUploadInput,
  EnvConfig,
  FeatureFlag,
} from './common.schemas';

export type {
  SignInInput,
  SignUpInput,
  PasswordResetInput,
  PasswordChangeInput,
  ProfileUpdateInput,
  ProfileCreateInput,
} from './user.schemas';

export type {
  TaskPriority,
  TaskStatus,
  BaseTask,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFormInput,
  TaskFilterInput,
  BulkTaskOperationInput,
} from './task.schemas';
