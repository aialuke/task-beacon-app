/**
 * Shared Authentication Types
 * 
 * Types for user authentication, authorization, sessions, and auth operations.
 * Used across auth services, contexts, and components.
 */

import type { User, Session } from '@supabase/supabase-js';

// Re-export Supabase auth types for convenience
export type { User, Session };

// Authentication response types
export interface AuthResponse {
  user: User;
  session: Session | null;
  emailConfirmed: boolean;
}

export interface SignUpOptions {
  data?: {
    full_name?: string;
    name?: string;
    [key: string]: any;
  };
  redirectTo?: string;
}

// User role and permission types
export type UserRole = 'admin' | 'manager' | 'user';

export interface UserPermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canAssignTasks: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Auth state management
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  error: string | null;
}

// Auth form types
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name?: string;
  confirmPassword?: string;
}

// Session management types
export interface SessionRefreshResult {
  user: User | null;
  session: Session | null;
  error?: string;
}

// Auth operation results
export interface AuthOperationResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
  requiresEmailConfirmation?: boolean;
} 