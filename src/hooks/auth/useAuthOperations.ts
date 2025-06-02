/**
 * Auth Operations Hook
 * 
 * Handles authentication operations like sign out and session refresh.
 * Provides consistent error handling and fallback mechanisms.
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/lib/api';
import { authLogger } from '@/lib/logger';
import { toast } from '@/lib/toast';
import { cleanupAuthState, handleAuthError } from '@/lib/auth-utils';
import type { UseAuthStateReturn } from './useAuthState';

interface UseAuthOperationsProps {
  updateSessionAndUser: UseAuthStateReturn['updateSessionAndUser'];
  clearAuthState: UseAuthStateReturn['clearAuthState'];
  setLoading: UseAuthStateReturn['setLoading'];
  setError: UseAuthStateReturn['setError'];
}

export interface UseAuthOperationsReturn {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Hook for authentication operations
 */
export function useAuthOperations({
  updateSessionAndUser,
  clearAuthState,
  setLoading,
  setError,
}: UseAuthOperationsProps): UseAuthOperationsReturn {
  
  // Refresh session function with fallback
  const refreshSession = useCallback(async () => {
    try {
      authLogger.debug('Starting session refresh');
      
      const response = await AuthService.refreshSession();
      
      if (response.success) {
        updateSessionAndUser(response.data?.session ?? null);
        authLogger.info('Session refreshed successfully via AuthService');
      } else {
        authLogger.warn('AuthService refresh failed, attempting direct refresh', { 
          error: response.error?.message 
        });
        
        // Fallback to direct Supabase refresh
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;

        updateSessionAndUser(data.session);
        authLogger.info('Session refreshed successfully via fallback');
      }
    } catch (error) {
      const authError = handleAuthError(error, 'refreshSession');
      setError(authError);
    }
  }, [updateSessionAndUser, setError]);

  // Sign out function with enhanced cleanup
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      authLogger.info('Starting sign out process');

      // Clean up auth state first
      cleanupAuthState();

      // Use AuthService for sign out
      const response = await AuthService.signOut();
      
      if (response.success) {
        authLogger.info('Sign out completed via AuthService');
      } else {
        authLogger.warn('AuthService sign out failed, attempting direct sign out', { 
          error: response.error?.message 
        });
        
        // Fallback to direct sign out
        await supabase.auth.signOut({ scope: 'global' });
      }

      // Clear local state
      clearAuthState();

      toast.success('Signed out successfully');
      authLogger.info('Sign out completed successfully');

      // Navigate to auth page
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
    } catch (error) {
      const authError = handleAuthError(error, 'signOut');
      setError(authError);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearAuthState, setError]);

  return {
    signOut,
    refreshSession,
  };
} 