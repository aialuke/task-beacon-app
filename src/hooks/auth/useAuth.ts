
/**
 * Simplified Auth Hook
 * 
 * Consolidates all auth functionality into a single, easy-to-use hook.
 * Replaces the complex multi-hook architecture with a simpler approach.
 */

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/lib/api/auth.service';
import type { ApiError } from '@/types/shared';
import { cleanupAuthState } from '@/lib/auth-utils';

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

  // Update session and user together
  const updateSessionAndUser = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setError(null);
  }, []);

  // Clear auth state
  const clearAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
    setError(null);
  }, []);

  // Sign in operation
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.signIn(email, password);
      if (!response.isSuccess) {
        setError({ 
          name: 'SignInError', 
          message: response.error || 'Failed to sign in' 
        });
        clearAuthState();
        return;
      }
      
      // Session will be updated by the auth state listener
    } catch (err: any) {
      setError({ 
        name: 'SignInError', 
        message: err?.message || 'Failed to sign in' 
      });
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  // Sign out operation
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean up auth state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError({ name: 'SignOutError', message: error.message });
        return;
      }

      clearAuthState();
    } catch (err: any) {
      setError({ 
        name: 'SignOutError', 
        message: 'An unexpected error occurred during sign out' 
      });
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  // Refresh session operation
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.refreshSession();
      if (error) {
        setError({ name: 'RefreshError', message: error.message });
        return;
      }
    } catch (err: any) {
      setError({ 
        name: 'RefreshError', 
        message: 'Failed to refresh session' 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth and set up listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          clearAuthState();
          return;
        }

        updateSessionAndUser(session);
      } catch (err) {
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
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateSessionAndUser, clearAuthState]);

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
