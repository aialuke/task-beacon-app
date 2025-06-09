/**
 * Authentication Types
 * 
 * All authentication-related type definitions.
 */

// === SUPABASE AUTH IMPORTS ===
export type { User as AuthUser, Session } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

// === AUTH RESPONSE TYPES ===
export interface AuthResponse {
  user: User;
  session: Session | null;
  emailConfirmed: boolean;
}

export interface SignUpOptions {
  data?: {
    full_name?: string;
    name?: string;
    [key: string]: unknown;
  };
  redirectTo?: string;
}

// === AUTH CONTEXT TYPES ===
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  error: string | null;
}

// === AUTH CREDENTIALS TYPES ===
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name?: string;
  confirmPassword?: string;
} 