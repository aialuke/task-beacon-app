/**
 * Auth Initialization Hook
 * 
 * Handles initial auth state setup and session checking.
 */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';

/**
 * Hook to initialize authentication state on app startup
 */
export function useAuthInitialization() {
  const { updateSessionAndUser, clearAuthState } = useAuthState();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          clearAuthState();
          return;
        }

        updateSessionAndUser(session);
      } catch (err) {
        clearAuthState();
      }
    };

    initializeAuth();
  }, [updateSessionAndUser, clearAuthState]);
}
