/**
 * Auth Listener Hook
 * 
 * Sets up Supabase auth state change listener.
 */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { ApiError } from '@/types/shared';

export interface UseAuthListenerProps {
  updateSessionAndUser: (session: Session | null) => void;
  setError: (error: ApiError | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useAuthListener({
  updateSessionAndUser,
  setError,
  setLoading,
}: UseAuthListenerProps) {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
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
      subscription.unsubscribe();
    };
  }, [updateSessionAndUser, setError, setLoading]);
}
