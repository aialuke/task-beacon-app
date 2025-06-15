/**
 * Simplified Auth Hook - Enhanced with Mobile Error Handling
 * 
 * Consolidates all auth functionality into a single, easy-to-use hook.
 * Replaces the complex multi-hook architecture with a simpler approach.
 */

import { User, Session } from '@supabase/supabase-js';
import { useState, useEffect, useCallback } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/lib/api/AuthService';
import { cleanupAuthState } from '@/lib/auth-utils';
import { logger, realtimeLogger } from '@/lib/logger';
import type { ApiError } from '@/types/shared';

export interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: ApiError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Simplified auth hook that handles all authentication state and operations
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Enhanced logging for mobile debugging
  const logMobileDebug = useCallback((message: string, data?: Record<string, unknown>) => {
    logger.auth(`Mobile Debug: ${message}`, {
      timestamp: new Date().toISOString(),
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...(data || {})
    });
  }, []);

  // Update session and user together
  const updateSessionAndUser = useCallback((newSession: Session | null) => {
    logMobileDebug('Updating session and user', { 
      hasSession: !!newSession, 
      hasUser: !!newSession?.user 
    });
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setError(null);
  }, [logMobileDebug]);

  // Clear auth state
  const clearAuthState = useCallback(() => {
    logMobileDebug('Clearing auth state');
    setSession(null);
    setUser(null);
    setError(null);
  }, [logMobileDebug]);

  // Sign in operation
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      logMobileDebug('Starting sign in process');
      setLoading(true);
      setError(null);
      
      const response = await AuthService.signIn(email, password);
      if (!response.success) {
        logMobileDebug('Sign in failed', { error: response.error });
        setError(response.error || { 
          message: 'Failed to sign in',
          code: 'SIGN_IN_ERROR'
        });
        clearAuthState();
        return;
      }
      
      logMobileDebug('Sign in successful');
      // Session will be updated by the auth state listener
    } catch (err: unknown) {
      logMobileDebug('Sign in error caught', { error: err });
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError({ 
        message: errorMessage,
        code: 'SIGN_IN_ERROR'
      });
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [clearAuthState, logMobileDebug]);

  // Sign out operation
  const signOut = useCallback(async () => {
    try {
      logMobileDebug('Starting sign out process');
      setLoading(true);
      setError(null);

      // Clean up auth state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        logMobileDebug('Sign out error', { error });
        setError({ message: error.message, code: 'SIGN_OUT_ERROR' });
        return;
      }

      logMobileDebug('Sign out successful');
      clearAuthState();
    } catch (err: unknown) {
      logMobileDebug('Sign out error caught', { error: err });
      setError({ 
        message: 'An unexpected error occurred during sign out',
        code: 'SIGN_OUT_ERROR'
      });
    } finally {
      setLoading(false);
    }
  }, [clearAuthState, logMobileDebug]);

  // Refresh session operation
  const refreshSession = useCallback(async () => {
    try {
      logMobileDebug('Starting session refresh');
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.refreshSession();
      if (error) {
        logMobileDebug('Session refresh error', { error });
        setError({ message: error.message, code: 'REFRESH_ERROR' });
        return;
      }
      
      logMobileDebug('Session refresh successful');
    } catch (err: unknown) {
      logMobileDebug('Session refresh error caught', { error: err });
      setError({ 
        message: 'Failed to refresh session',
        code: 'REFRESH_ERROR'
      });
    } finally {
      setLoading(false);
    }
  }, [logMobileDebug]);

  // Initialize auth and set up listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        logMobileDebug('Initializing auth');
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          logMobileDebug('Initial session error', { error });
          clearAuthState();
          return;
        }

        logMobileDebug('Initial session retrieved', { hasSession: !!session });
        updateSessionAndUser(session);
      } catch (err) {
        logMobileDebug('Initialize auth error caught', { error: err });
        if (mounted) {
          clearAuthState();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        logMobileDebug('Auth state change', { event, hasSession: !!session });
        realtimeLogger.info('Auth state change subscription', { 
          event, 
          hasSession: !!session,
          userId: session?.user?.id 
        });
        
        updateSessionAndUser(session);
        
        // Handle specific events
        if (event === 'SIGNED_OUT') {
          setError(null);
        }
        
        // Set loading to false after auth state is determined
        setLoading(false);
      }
    );

    // Initialize auth state
    void initializeAuth();

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
    error,
    signIn,
    signOut,
    refreshSession,
  };
} 