/**
 * Core User Domain Types
 * 
 * Central user entity definitions and related types used across all user features.
 * These are the core domain models for user management.
 */

import type { BaseEntity, ID, Timestamp } from '../shared/common.types';
import type { UserRole } from '../shared/auth.types';

// Core user entity
export interface User extends BaseEntity {
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  is_active: boolean;
  email_confirmed_at?: Timestamp | null;
  last_sign_in_at?: Timestamp | null;
  phone?: string | null;
  timezone?: string;
  locale?: string;
  preferences?: UserPreferences;
}

// User profile and settings
export interface UserProfile {
  id: ID;
  user_id: ID;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  linkedin_profile?: string;
  github_username?: string;
  company?: string;
  job_title?: string;
  skills?: string[];
  interests?: string[];
  privacy_settings: UserPrivacySettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  date_format: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  time_format: '12h' | '24h';
  notifications: NotificationPreferences;
  dashboard_layout?: string;
  task_view_preference: 'list' | 'card' | 'kanban';
  items_per_page: number;
  auto_save: boolean;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  task_assignments: boolean;
  task_due_reminders: boolean;
  task_completions: boolean;
  team_updates: boolean;
  system_announcements: boolean;
  marketing_emails: boolean;
  digest_frequency: 'never' | 'daily' | 'weekly' | 'monthly';
}

export interface UserPrivacySettings {
  profile_visibility: 'public' | 'team' | 'private';
  show_email: boolean;
  show_last_active: boolean;
  allow_direct_messages: boolean;
  show_activity: boolean;
  searchable: boolean;
}

// User creation and update interfaces
export interface UserCreateData {
  email: string;
  name?: string;
  full_name?: string;
  role?: UserRole;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  locale?: string;
  send_invitation?: boolean;
}

export interface UserUpdateData {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  is_active?: boolean;
  phone?: string;
  timezone?: string;
  locale?: string;
  preferences?: Partial<UserPreferences>;
}

// User query and search interfaces
export interface UserQueryOptions {
  role?: UserRole[];
  is_active?: boolean;
  email_confirmed?: boolean;
  search?: string;
  team_id?: ID;
  created_after?: Timestamp;
  created_before?: Timestamp;
  last_active_after?: Timestamp;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'email' | 'created_at' | 'last_sign_in_at' | 'role';
  sortDirection?: 'asc' | 'desc';
}

export interface UserSearchFilters {
  query?: string;
  roles?: UserRole[];
  teams?: ID[];
  skills?: string[];
  locations?: string[];
  is_active?: boolean;
  email_confirmed?: boolean;
  has_avatar?: boolean;
  joined_after?: Timestamp;
  joined_before?: Timestamp;
  last_active_after?: Timestamp;
  last_active_before?: Timestamp;
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

// User statistics and analytics
export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  confirmed_users: number;
  unconfirmed_users: number;
  users_by_role: Record<UserRole, number>;
  new_users_this_month: number;
  active_users_today: number;
  active_users_this_week: number;
  average_session_duration: number;
  user_retention_rate: number;
}

// Team and collaboration
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  avatar_url?: string;
  is_private: boolean;
  created_by: ID;
  member_count: number;
  settings: TeamSettings;
}

export interface TeamMember extends BaseEntity {
  team_id: ID;
  user_id: ID;
  role: 'owner' | 'admin' | 'member';
  joined_at: Timestamp;
  invited_by?: ID;
  is_active: boolean;
}

export interface TeamSettings {
  allow_member_invite: boolean;
  require_approval: boolean;
  default_task_visibility: 'team' | 'public' | 'private';
  allow_external_sharing: boolean;
  task_assignment_restrictions: 'none' | 'team_only' | 'admin_only';
}

// User invitations
export interface UserInvitation extends BaseEntity {
  email: string;
  invited_by: ID;
  team_id?: ID;
  role: UserRole;
  token: string;
  expires_at: Timestamp;
  accepted_at?: Timestamp | null;
  is_expired: boolean;
}

// User sessions and activity
export interface UserSession extends BaseEntity {
  user_id: ID;
  ip_address: string;
  user_agent: string;
  location?: string;
  is_current: boolean;
  expires_at: Timestamp;
  last_activity: Timestamp;
}

export interface UserActivity extends BaseEntity {
  user_id: ID;
  activity_type: 'login' | 'logout' | 'task_created' | 'task_updated' | 'task_completed' | 'profile_updated';
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// User authentication and security
export interface UserAuthSettings {
  two_factor_enabled: boolean;
  backup_codes_generated: boolean;
  recovery_email?: string;
  password_last_changed: Timestamp;
  failed_login_attempts: number;
  account_locked_until?: Timestamp | null;
  trusted_devices: TrustedDevice[];
}

export interface TrustedDevice {
  id: ID;
  name: string;
  fingerprint: string;
  last_used: Timestamp;
  created_at: Timestamp;
  is_current: boolean;
}

// User bulk operations
export interface UserBulkOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'update_role' | 'send_invitation';
  user_ids: ID[];
  data?: {
    role?: UserRole;
    team_id?: ID;
    message?: string;
  };
}

export interface UserBulkOperationResult {
  success_count: number;
  error_count: number;
  errors: {
    user_id: ID;
    error: string;
  }[];
}

// User import/export
export interface UserExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  include_fields: (keyof User)[];
  filters?: UserSearchFilters;
  include_profile_data: boolean;
  include_activity_data: boolean;
}

export interface UserImportData {
  users: Partial<UserCreateData>[];
  options: {
    send_invitations: boolean;
    skip_duplicates: boolean;
    default_role: UserRole;
    default_team_id?: ID;
  };
}

export interface UserImportResult {
  imported_count: number;
  skipped_count: number;
  error_count: number;
  invited_count: number;
  errors: {
    row: number;
    email: string;
    error: string;
  }[];
} 