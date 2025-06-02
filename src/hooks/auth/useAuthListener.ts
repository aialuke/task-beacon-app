/**
 * Auth Listener Hook
 * 
 * Manages Supabase auth state change subscription and handles different auth events.
 * Provides clean subscription management and event handling.
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authLogger } from '@/lib/logger';
import type { UseAuthStateReturn } from './useAuthState';

interface UseAuthListenerProps {
  updateSessionAndUser: UseAuthStateReturn['updateSessionAndUser'];
  setError: UseAuthStateReturn['setError'];
  setLoading: UseAuthStateReturn['setLoading'];
}

/**
 * Hook for handling auth state changes
 */
export function useAuthListener({
  updateSessionAndUser,
  setError,
  setLoading,
}: UseAuthListenerProps): void {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      authLogger.debug('Auth state change detected', { 
        event, 
        userId: session?.user?.id,
        hasSession: !!session 
      });

      if (!mountedRef.current) return;

      // Update session and user state
      updateSessionAndUser(session);

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            // Defer any additional processing to prevent deadlocks
            setTimeout(() => {
              if (mountedRef.current) {
                setError(null);
                setLoading(false);
                authLogger.info('User signed in successfully', { userId: session.user.id });
              }
            }, 0);
          }
          break;

        case 'SIGNED_OUT':
          setError(null);
          setLoading(false);
          authLogger.info('User signed out');
          break;

        case 'TOKEN_REFRESHED':
          authLogger.debug('Auth token refreshed');
          break;

        case 'PASSWORD_RECOVERY':
          authLogger.info('Password recovery initiated');
          break;

        case 'USER_UPDATED':
          authLogger.debug('User profile updated');
          break;

        default:
          authLogger.debug('Unhandled auth event', { event });
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      authLogger.debug('Auth listener cleanup completed');
    };
  }, [updateSessionAndUser, setError, setLoading]);

  // Cleanup ref on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
} 