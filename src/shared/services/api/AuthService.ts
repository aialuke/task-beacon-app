
import { AuthError, AuthResponse, User } from '@supabase/supabase-js';

import { supabase } from '../supabase/client';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthServiceResponse<T = any> {
  data: T | null;
  error: AuthError | null;
}

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthServiceResponse<User>> {
    try {
      const signUpOptions = {
        email: credentials.email,
        password: credentials.password,
        options: credentials.name ? {
          data: {
            name: credentials.name,
          }
        } : undefined,
      };

      const { data, error } = await supabase.auth.signUp(signUpOptions);

      if (error) {
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthServiceResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { data: null, error };
      }

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthServiceResponse<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { data: null, error };
      }

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Update user metadata
   */
  async updateUserMetadata(metadata: Record<string, any>): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) {
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  }
}

export const authService = new AuthService();
