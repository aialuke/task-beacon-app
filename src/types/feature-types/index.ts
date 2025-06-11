/**
 * Feature Types Barrel - Simplified
 *
 * Clean exports for domain-specific types without overwhelming the developer.
 */

// Task domain types (most commonly used)
export type { TaskFilter, TaskCreateData, TaskUpdateData } from './task.types';

// User domain types (essential only)
export type { UserQueryOptions } from './user.types';
