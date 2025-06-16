/**
 * Unified Auth Functions
 *
 * Provides all authentication functionality as simple, standalone functions.
 * Replaces the class-based AuthService.
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
 * Get current session
 */
export async function getCurrentSession(): Promise<ServiceResult<Session>> {
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
export async function getCurrentUser(): Promise<ServiceResult<User>> {
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
export async function getCurrentUserId(): Promise<ServiceResult<string>> {
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
      data: user.id,
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
 * Check if a user is currently authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}

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

/**
 * Set up a listener for authentication state changes.
 *
 * @param callback - The function to call when auth state changes.
 * @returns An object with a `unsubscribe` method.
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
