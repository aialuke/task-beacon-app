
/**
 * Auth Core Service - Core Authentication Operations
 * 
 * Handles sign in, sign up, and sign out operations.
 */

import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, ApiError, AuthResponse } from '@/types';

// === HELPER FUNCTIONS ===
function createApiError(message: string, code?: string): ApiError {
  return {
    message,
    name: 'AuthError',
    code: code ?? 'AUTH_ERROR',
  };
}

/**
 * Core Authentication Service - Sign in, sign up, and sign out operations
 */
export class AuthCoreService {
  /**
   * Sign in user
   */
  static async signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: createApiError(error.message),
          data: null,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: createApiError('Sign in failed - no user returned'),
          data: null,
        };
      }

      const authResponse: AuthResponse = {
        user: data.user,
        session: data.session,
        emailConfirmed: !!data.user.email_confirmed_at,
      };

      return {
        success: true,
        error: null,
        data: authResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error instanceof Error ? error.message : 'Unknown error'),
        data: null,
      };
    }
  }

  /**
   * Sign up user
   */
  static async signUp(email: string, password: string, options?: unknown): Promise<ApiResponse<AuthResponse>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        return {
          success: false,
          error: createApiError(error.message),
          data: null,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: createApiError('Sign up failed - no user returned'),
          data: null,
        };
      }

      const authResponse: AuthResponse = {
        user: data.user,
        session: data.session,
        emailConfirmed: !!data.user.email_confirmed_at,
      };

      return {
        success: true,
        error: null,
        data: authResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error instanceof Error ? error.message : 'Unknown error'),
        data: null,
      };
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: createApiError(error.message),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(error instanceof Error ? error.message : 'Unknown error'),
        data: null,
      };
    }
  }
}
