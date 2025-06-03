/**
 * Core User Domain Types
 * 
 * Simplified user entity definitions and related types for essential user management.
 * Focused on core functionality while maintaining clean, maintainable interfaces.
 */

import type { BaseEntity, ID, Timestamp } from '../shared/common.types';
import type { UserRole } from '../shared/auth.types';

// Core user entity - simplified to essential fields
export interface User extends BaseEntity {
  email: string;
  name?: string;
  full_name?: string;
  role?: UserRole;
  email_confirmed_at?: Timestamp | null;
  last_sign_in_at?: Timestamp | null;
  timezone?: string;
  locale?: string;
  preferences?: UserPreferences;
}

// User preferences - focused on essential app behavior settings
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  date_format: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  time_format: '12h' | '24h';
  notifications: NotificationPreferences;
  task_view_preference: 'list' | 'card' | 'kanban';
  items_per_page: number;
  auto_save: boolean;
}

// Essential notification preferences
export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  task_assignments: boolean;
  task_due_reminders: boolean;
  task_completions: boolean;
  team_updates: boolean;
  system_announcements: boolean;
  digest_frequency: 'never' | 'daily' | 'weekly' | 'monthly';
}

// User creation and update interfaces - simplified
export interface UserCreateData {
  email: string;
  name?: string;
  full_name?: string;
  role?: UserRole;
  timezone?: string;
  locale?: string;
}

export interface UserUpdateData {
  name?: string;
  full_name?: string;
  role?: UserRole;
  timezone?: string;
  locale?: string;
  preferences?: Partial<UserPreferences>;
}

// User query and search interfaces - essential filtering only
export interface UserQueryOptions {
  role?: UserRole[];
  email_confirmed?: boolean;
  search?: string;
  team_id?: ID;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'email' | 'created_at' | 'role';
  sortDirection?: 'asc' | 'desc';
}

export interface UserSearchFilters {
  query?: string;
  roles?: UserRole[];
  teams?: ID[];
  email_confirmed?: boolean;
}

// User list and pagination
export interface UserListResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: UserSearchFilters;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Simplified team management
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  created_by: ID;
  member_count: number;
}

export interface TeamMember extends BaseEntity {
  team_id: ID;
  user_id: ID;
  role: 'owner' | 'admin' | 'member';
  joined_at: Timestamp;
}

// Essential bulk operations
export interface UserBulkUpdateOperation {
  action: 'update_role';
  user_ids: ID[];
  data?: {
    role?: UserRole;
  };
}

export interface UserBulkUpdateResult {
  success_count: number;
  error_count: number;
  errors: {
    user_id: ID;
    error: string;
  }[];
}

// Import/Export - simplified to essential data
export interface UserExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  include_fields: (keyof User)[];
  filters?: UserSearchFilters;
}

export interface UserImportData {
  users: Partial<UserCreateData>[];
  options: {
    skip_duplicates: boolean;
    default_role: UserRole;
    default_team_id?: ID;
  };
}

export interface UserImportResult {
  imported_count: number;
  skipped_count: number;
  error_count: number;
  errors: {
    row: number;
    email: string;
    error: string;
  }[];
} 