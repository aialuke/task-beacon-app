/**
 * Authentication Hook
 *
 * Unified authentication state management using consistent patterns.
 * **Updated**: Now uses unified error management patterns.
 */

import { User, Session } from '@supabase/supabase-js';
import { useState, useEffect, useCallback } from 'react';

import { cleanupAuthState } from '@/lib/auth-utils';
import { logger } from '@/lib/logger';
import { AuthService } from '@/shared/services/api';
import { supabase } from '@/shared/services/supabase/client';
import type { ApiError } from '@/types';

import { useUnifiedError } from './useUnifiedError';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: ApiError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

/**
 * Simplified auth hook that handles all authentication state and operations
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Use unified error management
  const { error, handleError, clearError } = useUnifiedError({
    showToast: true,
    context: 'Authentication',
  });

  // Enhanced logging for mobile debugging
  const logMobileDebug = useCallback(
    (message: string, data?: Record<string, unknown>) => {
      logger.auth(`Mobile Debug: ${message}`, {
        timestamp: new Date().toISOString(),
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...(data || {}),
      });
    },
    []
  );

  // Update session and user together
  const updateSessionAndUser = useCallback(
    (newSession: Session | null) => {
      logMobileDebug('Updating session and user', {
        hasSession: !!newSession,
        hasUser: !!newSession?.user,
      });
      setSession(newSession);
      setUser(newSession?.user ?? null);
      clearError();
    },
    [logMobileDebug, clearError]
  );

  // Clear auth state
  const clearAuthState = useCallback(() => {
    logMobileDebug('Clearing auth state');
    setSession(null);
    setUser(null);
    clearError();
  }, [logMobileDebug, clearError]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session/token
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token and get user data
          // This would typically involve an API call
          setLoading(true);
          const response = await AuthService.signIn(token, '');
          if (response.success) {
            logMobileDebug('Initial session retrieved', {
              hasSession: !!session,
            });
            updateSessionAndUser(session);
          } else {
            logMobileDebug('Initial session error', { error: response.error });
            clearAuthState();
          }
        }
      } catch (err) {
        logMobileDebug('Initialize auth error caught', { error: err });
        handleError(err, 'Failed to initialize authentication');
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [handleError, updateSessionAndUser, clearAuthState, logMobileDebug]);

  // Sign in operation
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        logMobileDebug('Starting sign in process');
        setLoading(true);
        clearError();

        const response = await AuthService.signIn(email, password);
        if (!response.success) {
          logMobileDebug('Sign in failed', { error: response.error });
          handleError(
            new Error(response.error?.message || 'Failed to sign in'),
            'Sign in failed'
          );
          clearAuthState();
          return;
        }

        logMobileDebug('Sign in successful');
        // Session will be updated by the auth state listener
      } catch (err: unknown) {
        logMobileDebug('Sign in error caught', { error: err });
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to sign in';
        handleError(new Error(errorMessage), 'Sign in failed');
        clearAuthState();
      } finally {
        setLoading(false);
      }
    },
    [handleError, clearAuthState, logMobileDebug]
  );

  // Sign out operation
  const signOut = useCallback(async () => {
    try {
      logMobileDebug('Starting sign out process');
      setLoading(true);
      clearError();

      // Clean up auth state first
      cleanupAuthState();

      const { error } = await supabase.auth.signOut();
      if (error) {
        logMobileDebug('Sign out error', { error });
        handleError(new Error(error.message), 'Sign out failed');
        return;
      }

      logMobileDebug('Sign out successful');
      clearAuthState();
    } catch (err: unknown) {
      logMobileDebug('Sign out error caught', { error: err });
      handleError(err, 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }, [handleError, clearAuthState, logMobileDebug]);

  // Refresh session operation
  const refreshSession = useCallback(async () => {
    try {
      logMobileDebug('Starting session refresh');
      setLoading(true);
      clearError();

      const { error } = await supabase.auth.refreshSession();
      if (error) {
        logMobileDebug('Session refresh error', { error });
        handleError(new Error(error.message), 'Failed to refresh session');
        return;
      }

      logMobileDebug('Session refresh successful');
    } catch (err: unknown) {
      logMobileDebug('Session refresh error caught', { error: err });
      handleError(err, 'Failed to refresh session');
    } finally {
      setLoading(false);
    }
  }, [handleError, logMobileDebug]);

  // Set up auth state listener
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      logMobileDebug('Auth state change', { event, hasSession: !!session });

      updateSessionAndUser(session);

      // Handle specific events
      if (event === 'SIGNED_OUT') {
        clearError();
      }

      // Set loading to false after auth state is determined
      setLoading(false);
    });

    return () => {
      logMobileDebug('Cleaning up auth hook');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateSessionAndUser, clearAuthState, logMobileDebug]);

  return {
    user,
    session,
    loading,
    error: error
      ? { message: error.message, code: 'AUTH_ERROR', statusCode: 500 }
      : null,
    signIn,
    signOut,
    refreshSession,
    clearError,
  };
}
