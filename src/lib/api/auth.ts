/**
 * Unified Auth Functions
 *
 * Provides all authentication functionality as simple, standalone functions.
 * Replaces the class-based AuthService.
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

// === CORE AUTHENTICATION OPERATIONS ===

/**
 * Sign in user with email and password
 */
export async function signIn(
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
export async function signUp(
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
export async function signOut(): Promise<ApiResponse<void>> {
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
 * Refresh the current session
 *
 * Note: Supabase client automatically refreshes the token. This is for manual refreshing.
 */
export async function refreshSession(): Promise<
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
        error: createApiError('Session refresh failed'),
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
