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

// Core user domain types
export type {
  // Core user entities
  User,
  UserProfile,
  UserPreferences,
  NotificationPreferences,
  UserPrivacySettings,
  
  // User operations
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
  UserSearchFilters,
  UserListResponse,
  
  // User features
  UserStatistics,
  Team,
  TeamMember,
  TeamSettings,
  UserInvitation,
  UserSession,
  UserActivity,
  
  // User security
  UserAuthSettings,
  TrustedDevice,
  
  // User bulk operations
  UserBulkOperation,
  UserBulkOperationResult,
  
  // User import/export
  UserExportOptions,
  UserImportData,
  UserImportResult,
} from './user.types'; 