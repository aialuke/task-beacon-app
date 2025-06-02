
/**
 * Authentication Service
 * 
 * Provides authentication operations abstracted from Supabase.
 */

import { User } from '@supabase/supabase-js';
import { apiRequest } from './error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, AuthResponse, SignUpOptions } from '@/types/shared';

/**
 * Authentication utilities abstracted from Supabase
 */
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('auth.signIn', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Sign in failed - no user returned');

      return {
        user: data.user,
        session: data.session,
        emailConfirmed: !!data.user.email_confirmed_at,
      };
    });
  }

  /**
   * Sign up with email and password
   */
  static async signUp(
    email: string, 
    password: string, 
    options?: SignUpOptions
  ): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('auth.signUp', async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Sign up failed - no user returned');

      return {
        user: data.user,
        session: data.session,
        emailConfirmed: !!data.user.email_confirmed_at,
      };
    });
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest('auth.getCurrentUser', async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No authenticated user');
      return user;
    });
  }

  /**
   * Get current user ID
   */
  static async getCurrentUserId(): Promise<ApiResponse<string>> {
    return apiRequest('auth.getCurrentUserId', async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No authenticated user');
      return user.id;
    });
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<ApiResponse<void>> {
    return apiRequest('auth.signOut', async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    });
  }

  /**
   * Refresh the current session
   */
  static async refreshSession(): Promise<ApiResponse<{ user: User | null; session: any }>> {
    return apiRequest('auth.refreshSession', async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { user: data.user, session: data.session };
    });
  }
}
