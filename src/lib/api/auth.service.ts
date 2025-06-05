
// === EXTERNAL LIBRARIES ===
import type { User, Session } from '@supabase/supabase-js';

// === INTERNAL UTILITIES ===
import { supabase } from '@/integrations/supabase/client';

// === TYPES (direct imports from unified system) ===
import type { ApiResponse, ServiceResult, ActionResult } from '@/types/api.types';
import type { SignInCredentials, SignUpCredentials } from '@/types/shared/auth.types';

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
          error: {
            message: error.message,
            name: 'AuthError',
            code: error.name,
          },
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
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'AuthError',
        },
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
          error: {
            message: error.message,
            name: 'AuthError',
            code: error.name,
          },
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
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'AuthError',
        },
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
          error: userResult.error || {
            message: 'No user found',
            name: 'AuthError',
          },
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
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'AuthError',
        },
        data: null,
      };
    }
  }

  /**
   * Sign in user
   */
  static async signIn(credentials: SignInCredentials): Promise<ActionResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: 'AuthError',
            code: error.name,
          },
        };
      }

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'AuthError',
        },
      };
    }
  }

  /**
   * Sign up user
   */
  static async signUp(credentials: SignUpCredentials): Promise<ActionResult> {
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: 'AuthError',
            code: error.name,
          },
        };
      }

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'AuthError',
        },
      };
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<ActionResult> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: 'AuthError',
            code: error.name,
          },
        };
      }

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: 'AuthError',
        },
      };
    }
  }
}
