
// === EXTERNAL LIBRARIES ===
import type { User, Session } from '@supabase/supabase-js';

// === INTERNAL UTILITIES ===
import { supabase } from '@/integrations/supabase/client';

// === TYPES (direct imports from unified system) ===
import type { ApiResponse, ServiceResult, ApiError } from '@/types/api.types';
import type { SignInCredentials, SignUpCredentials, AuthResponse } from '@/types/shared/auth.types';

// === HELPER FUNCTIONS ===
function createApiError(message: string, code?: string): ApiError {
  return {
    message,
    name: 'AuthError',
    code: code ?? 'AUTH_ERROR',
  };
}

// === AUTH SERVICE ===
export class AuthService {
  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<ServiceResult<Session>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          error: error.message,
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
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<ServiceResult<User>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return {
          success: false,
          error: error.message,
          data: null,
        };
      }

      if (!user) {
        return {
          success: false,
          error: 'No authenticated user',
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
        error: error instanceof Error ? error.message : 'Unknown error',
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
          error: userResult.error || 'No user found',
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
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return !!user;
    } catch {
      return false;
    }
  }

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

  /**
   * Refresh session
   */
  static async refreshSession(): Promise<ApiResponse<{ user: User; session: Session }>> {
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
        error: createApiError(error instanceof Error ? error.message : 'Unknown error'),
        data: null,
      };
    }
  }
}
// CodeRabbit review
// CodeRabbit review
