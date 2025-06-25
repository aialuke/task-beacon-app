/**
 * Unified Auth Functions
 *
 * Provides all authentication functionality as simple, standalone functions.
 * Replaces the class-based AuthService.
 */

import type { User, Session } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, AuthResponse } from '@/types';

import { withApiResponse } from './withApiResponse';

// === CORE AUTHENTICATION OPERATIONS ===

/**
 * Sign in user with email and password
 */
export async function signIn(
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> {
  return withApiResponse(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Sign in failed - no user returned');
    }

    const authResponse: AuthResponse = {
      user: data.user,
      session: data.session,
      emailConfirmed: !!data.user.email_confirmed_at,
    };

    return authResponse;
  });
}

/**
 * Sign up user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  options?: unknown,
): Promise<ApiResponse<AuthResponse>> {
  return withApiResponse(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Sign up failed - no user returned');
    }

    const authResponse: AuthResponse = {
      user: data.user,
      session: data.session,
      emailConfirmed: !!data.user.email_confirmed_at,
    };

    return authResponse;
  });
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse<void>> {
  return withApiResponse(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return null;
  });
}

/**
 * Refresh the current session (stub implementation for tests)
 */
export async function refreshSession(): Promise<ApiResponse<AuthResponse>> {
  return withApiResponse(async () => {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      const err = new Error(error.message);
      err.name = 'AuthError';
      throw err;
    }

    if (!data.user) {
      throw new Error('Session refresh failed - no user returned');
    }

    const authResponse: AuthResponse = {
      user: data.user,
      session: data.session,
      emailConfirmed: !!data.user?.email_confirmed_at,
    };

    return authResponse;
  });
}
