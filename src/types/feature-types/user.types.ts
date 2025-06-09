
/**
 * User Feature Types
 * 
 * User-specific types and interfaces for user management features.
 */

// Import from unified type system
import type { ID, Timestamp, UserRole } from '../index';

// User preferences and settings
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  taskReminders: boolean;
  taskAssignments: boolean;
  taskUpdates: boolean;
  dueDateWarnings: boolean;
}

// User creation and update data
export interface UserCreateData {
  email: string;
  name?: string;
  role?: UserRole;
  preferences?: Partial<UserPreferences>;
  notificationPreferences?: Partial<NotificationPreferences>;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: UserRole;
  avatar_url?: string;
}

// Query and filtering options
export interface UserQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  sortBy?: 'name' | 'email' | 'created_at';
  sortDirection?: 'asc' | 'desc';
}

// Search options for user service
export interface UserSearchOptions {
  query?: string;
  role?: UserRole;
  limit?: number;
  excludeCurrentUser?: boolean;
}

// Export convenience type aliases
export type UserId = ID;
export type UserTimestamp = Timestamp;
