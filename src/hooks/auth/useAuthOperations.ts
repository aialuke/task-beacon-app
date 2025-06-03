/**
 * Auth Operations Hook
 * 
 * Handles authentication operations (sign out, refresh session).
 */

import { useCallback } from 'react';
import { AuthService } from '@/lib/api/auth.service';
import type { Session } from '@supabase/supabase-js';
import type { ApiError } from '@/types/shared';

export interface UseAuthOperationsProps {
  updateSessionAndUser: (session: Session | null) => void;
  clearAuthState: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: ApiError | null) => void;
}

export interface UseAuthOperationsReturn {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useAuthOperations({
  updateSessionAndUser,
  clearAuthState,
  setLoading,
  setError,
}: UseAuthOperationsProps): UseAuthOperationsReturn {
  
  const signOut = useCallback(async () => {
    console.log('Sign out initiated');
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signOut();
      if (error) {
        console.error('Sign out error:', error);
        setError(error);
      } else {
        clearAuthState();
        console.log('Sign out successful');
      }
    } catch (err) {
      console.error('Sign out failed:', err);
      setError({ name: 'SignOutError', message: 'Failed to sign out' });
    } finally {
      setLoading(false);
    }
  }, [clearAuthState, setLoading, setError]);

  const refreshSession = useCallback(async () => {
    console.log('Refresh session initiated');
    setLoading(true);
    
    try {
      const { data, error } = await AuthService.refreshSession();
      if (error) {
        console.error('Refresh session error:', error);
        setError(error);
        clearAuthState();
      } else {
        updateSessionAndUser(data.session);
        console.log('Session refreshed successfully');
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setError({ name: 'RefreshError', message: 'Failed to refresh session' });
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [updateSessionAndUser, clearAuthState, setLoading, setError]);

  return {
    signOut,
    refreshSession,
  };
}
