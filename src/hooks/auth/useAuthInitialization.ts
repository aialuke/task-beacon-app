/**
 * Auth Initialization Hook
 * 
 * Handles initial auth state setup and session checking.
 */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import type { ApiError } from '@/types/shared';

export interface UseAuthInitializationProps {
  updateSessionAndUser: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: ApiError | null) => void;
}

export function useAuthInitialization({
  updateSessionAndUser,
  setLoading,
  setError,
}: UseAuthInitializationProps) {
  useEffect(() => {
    console.log('Initializing auth state');
    
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError({ name: 'SessionError', message: error.message });
        } else {
          console.log('Initial session check:', { session: !!session });
          updateSessionAndUser(session);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setError({ name: 'InitError', message: 'Failed to initialize authentication' });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [updateSessionAndUser, setLoading, setError]);
}
