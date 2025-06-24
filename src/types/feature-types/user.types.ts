/**
 * User Feature Types
 *
 * User-specific types and interfaces for user management features.
 */

// Import from unified type system
import type { ID, Timestamp, UserRole } from '../index';

// User preferences and settings
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  taskReminders: boolean;
  taskAssignments: boolean;
  taskUpdates: boolean;
  dueDateWarnings: boolean;
}

// User creation and update data
interface UserCreateData {
  email: string;
  name?: string;
  role?: UserRole;
  preferences?: Partial<UserPreferences>;
  notificationPreferences?: Partial<NotificationPreferences>;
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

// Export convenience type aliases
type UserId = ID;
type UserTimestamp = Timestamp;
