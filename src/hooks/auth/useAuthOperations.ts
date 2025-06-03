/**
 * Auth Operations Hook
 * 
 * Handles authentication operations (sign out, refresh session).
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ApiError } from '@/types/shared';
import { AuthService } from '@/lib/api/auth.service';
import { User, Session } from '@supabase/supabase-js';

export interface UseAuthOperationsProps {
  setError: (error: ApiError | null) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export interface UseAuthOperationsReturn {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

/**
 * Hook for authentication operations (sign out, refresh session)
 */
export function useAuthOperations({ setError, setLoading, setUser, setSession }: UseAuthOperationsProps): UseAuthOperationsReturn {
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError({ name: 'SignOutError', message: error.message });
        return;
      }

    } catch (err) {
      setError({ name: 'SignOutError', message: 'An unexpected error occurred during sign out' });
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        setError({ name: 'RefreshError', message: error.message });
        return;
      }

    } catch (err) {
      setError({ name: 'RefreshError', message: 'Failed to refresh session' });
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.signIn(email, password);
      if (!response.success || !response.data) {
        setError({ name: 'SignInError', message: response.error?.message || 'Failed to sign in' });
        setUser(null);
        setSession(null);
        return;
      }
      setUser(response.data.user);
      setSession(response.data.session);
    } catch (err: any) {
      setError({ name: 'SignInError', message: err?.message || 'Failed to sign in' });
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setUser, setSession]);

  return {
    signOut,
    refreshSession,
    signIn,
  };
}
