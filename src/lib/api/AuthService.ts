/**
 * Unified Auth Service - Phase 1 Consolidation
 *
 * Consolidates AuthService, AuthCoreService, and AuthSessionService into a single,
 * coherent service without unnecessary delegation layers.
 * Eliminates duplicate code and provides a clean, unified API.
 */

import type { User, Session } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import type {
  ApiResponse,
  ServiceResult,
  ApiError,
  AuthResponse,
} from '@/types';

// === HELPER FUNCTIONS ===
function createApiError(message: string, code?: string): ApiError {
  return {
    message,
    name: 'AuthError',
    code: code ?? 'AUTH_ERROR',
  };
}

/**
 * Unified Authentication Service
 *
 * Provides all authentication functionality in a single, cohesive service.
 * Replaces the fragmented AuthService/AuthCoreService/AuthSessionService architecture.
 */
export class AuthService {
  // === CORE AUTHENTICATION OPERATIONS ===

  /**
   * Sign in user with email and password
   */
  static async signIn(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
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
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }

  /**
   * Sign up user with email and password
   */
  static async signUp(
    email: string,
    password: string,
    options?: unknown
  ): Promise<ApiResponse<AuthResponse>> {
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
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }

  /**
   * Sign out current user
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
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }

  // === SESSION MANAGEMENT ===

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<ServiceResult<Session>> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

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
        data: session,
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<ServiceResult<User>> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return {
          success: false,
          error: createApiError(error.message),
          data: null,
        };
      }

      if (!user) {
        return {
          success: false,
          error: createApiError('No authenticated user'),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }

  /**
   * Get current user ID
   */
  static async getCurrentUserId(): Promise<ServiceResult<string>> {
    try {
      const userResult = await this.getCurrentUser();

      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: userResult.error || createApiError('No user found'),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: userResult.data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return !!user;
    } catch {
      return false;
    }
  }

  /**
   * Refresh current session
   */
  static async refreshSession(): Promise<
    ApiResponse<{ user: User; session: Session }>
  > {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return {
          success: false,
          error: createApiError(error.message),
          data: null,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: createApiError('Failed to refresh session'),
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createApiError(
          error instanceof Error ? error.message : 'Unknown error'
        ),
        data: null,
      };
    }
  }
}
