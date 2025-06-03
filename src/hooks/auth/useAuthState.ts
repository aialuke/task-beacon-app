/**
 * Auth State Hook
 * 
 * Manages the core authentication state (user, session, loading, error).
 */

import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import type { ApiError } from '@/types/shared';

export interface UseAuthStateReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: ApiError | null;
  updateSessionAndUser: (session: Session | null) => void;
  clearAuthState: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: ApiError | null) => void;
}

export function useAuthState(): UseAuthStateReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const updateSessionAndUser = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setError(null);
  }, []);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    session,
    loading,
    error,
    updateSessionAndUser,
    clearAuthState,
    setLoading,
    setError,
  };
}
