/**
 * Feature Types Barrel File
 * 
 * Centralized exports for core domain types that span multiple features.
 * These are the main business entities used across the application.
 */

// Core task domain types
export type {
  // Core task entities
  Task,
  ParentTask,
  TaskStatus,
  TaskFilter,
  TaskPriority,
  
  // Task operations
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
  TaskSearchFilters,
  TaskListResponse,
  
  // Task features
  TaskStatistics,
  TaskRelationship,
  TaskHistoryEntry,
  TaskComment,
  TaskAttachment,
  TaskTemplate,
  TaskNotification,
  
  // Task bulk operations
  TaskBulkOperation,
  TaskBulkOperationResult,
  
  // Task import/export
  TaskExportOptions,
  TaskImportData,
  TaskImportResult,
} from './task.types';

// Core user domain types - simplified
export type {
  // Core user entities
  User,
  UserPreferences,
  NotificationPreferences,
  
  // User operations
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
  UserSearchFilters,
  UserListResponse,
  
  // Team management
  Team,
  TeamMember,
  
  // User bulk operations
  UserBulkUpdateOperation,
  UserBulkUpdateResult,
  
  // User import/export
  UserExportOptions,
  UserImportData,
  UserImportResult,
} from './user.types'; 