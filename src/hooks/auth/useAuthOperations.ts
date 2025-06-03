/**
 * Auth Operations Hook
 * 
 * Handles authentication operations (sign out, refresh session).
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ApiError } from '@/types/shared';

export interface UseAuthOperationsProps {
  setError: (error: ApiError | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface UseAuthOperationsReturn {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Hook for authentication operations (sign out, refresh session)
 */
export function useAuthOperations({ setError, setLoading }: UseAuthOperationsProps): UseAuthOperationsReturn {
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

  return {
    signOut,
    refreshSession,
  };
}
