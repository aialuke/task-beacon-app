
/**
 * Auth Listener Hook
 * 
 * Sets up Supabase auth state change listener.
 */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ApiError } from '@/types/shared';

export interface UseAuthListenerProps {
  updateSessionAndUser: (session: any) => void;
  setError: (error: ApiError | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useAuthListener({
  updateSessionAndUser,
  setError,
  setLoading,
}: UseAuthListenerProps) {
  useEffect(() => {
    console.log('Setting up auth listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', { event, session: !!session });
        
        // Update auth state synchronously
        updateSessionAndUser(session);
        
        // Handle specific events
        if (event === 'SIGNED_OUT') {
          setError(null);
        }
        
        // Set loading to false after auth state is determined
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [updateSessionAndUser, setError, setLoading]);
}
