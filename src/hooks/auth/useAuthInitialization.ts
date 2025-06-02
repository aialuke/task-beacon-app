/**
 * Auth Initialization Hook
 * 
 * Handles initial authentication state setup by checking for existing sessions.
 * Runs once on mount to establish initial auth state.
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authLogger } from '@/lib/logger';
import { handleAuthError } from '@/lib/auth-utils';
import type { UseAuthStateReturn } from './useAuthState';

interface UseAuthInitializationProps {
  updateSessionAndUser: UseAuthStateReturn['updateSessionAndUser'];
  setLoading: UseAuthStateReturn['setLoading'];
  setError: UseAuthStateReturn['setError'];
}

/**
 * Hook for initializing authentication state
 */
export function useAuthInitialization({
  updateSessionAndUser,
  setLoading,
  setError,
}: UseAuthInitializationProps): void {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const initializeAuth = async () => {
      try {
        authLogger.debug('Initializing auth state');
        
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          authLogger.error('Error getting session', error);
          if (mountedRef.current) {
            setError(error);
          }
          return;
        }

        if (mountedRef.current) {
          updateSessionAndUser(session);
          
          if (session?.user) {
            authLogger.info('Existing session found', { userId: session.user.id });
          } else {
            authLogger.debug('No existing session found');
          }
        }
      } catch (error) {
        const authError = handleAuthError(error, 'auth initialization');
        if (mountedRef.current) {
          setError(authError);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          authLogger.debug('Auth initialization completed');
        }
      }
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
    };
  }, [updateSessionAndUser, setLoading, setError]);

  // Cleanup ref on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
} 