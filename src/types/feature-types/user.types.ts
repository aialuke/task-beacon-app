
/**
 * User Feature Types
 * 
 * User-specific types and interfaces for user management features.
 */

// Import from unified type system instead of deleted common.types
import type { ID, Timestamp } from '../utility.types';

// User profile and management types
export interface UserFilter {
  role?: 'admin' | 'user' | 'viewer';
  status?: 'active' | 'inactive' | 'pending';
  search?: string;
  department?: string;
  lastActiveAfter?: string;
}

export interface UserPermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canAssignTasks: boolean;
  canViewAllTasks: boolean;
  canManageUsers: boolean;
  canAccessAnalytics: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  department?: string;
  permissions: UserPermissions;
  created_at: string;
  updated_at: string;
  last_active_at?: string;
}

// User activity and engagement
export interface UserActivity {
  userId: string;
  action: 'login' | 'logout' | 'task_created' | 'task_completed' | 'task_assigned';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasksAssigned: number;
  completionRate: number;
  averageTaskDuration?: number;
  lastActiveDate?: string;
}

// User query and filtering options
export interface UserQueryOptions {
  page?: number;
  pageSize?: number;
  filters?: UserFilter;
  sortBy?: 'name' | 'email' | 'created_at' | 'last_active_at' | 'role';
  sortDirection?: 'asc' | 'desc';
  includeInactive?: boolean;
}

// User management operations
export interface UserCreateData {
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'viewer';
  department?: string;
  permissions?: Partial<UserPermissions>;
}

export interface UserUpdateData extends Partial<UserCreateData> {
  id: string;
  status?: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
}

// User session and authentication
export interface UserSession {
  userId: string;
  sessionId: string;
  createdAt: string;
  expiresAt: string;
  lastActivity: string;
  ipAddress?: string;
  userAgent?: string;
}

// Export convenience type aliases
export type UserId = ID;
export type UserTimestamp = Timestamp;
