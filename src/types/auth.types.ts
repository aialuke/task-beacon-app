/**
 * Authentication Types
 *
 * All authentication-related type definitions.
 */

// === SUPABASE AUTH IMPORTS ===
import type { User, Session } from '@supabase/supabase-js';

export type { User as AuthUser, Session } from '@supabase/supabase-js';

// === AUTH RESPONSE TYPES ===
export interface AuthResponse {
  user: User;
  session: Session | null;
  emailConfirmed: boolean;
}

interface SignUpOptions {
  data?: {
    full_name?: string;
    name?: string;
    [key: string]: unknown;
  };
  redirectTo?: string;
}

// === AUTH STATE TYPES ===

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  error: string | null;
}

// === AUTH CREDENTIALS TYPES ===
interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends SignInCredentials {
  name?: string;
  confirmPassword?: string;
}
