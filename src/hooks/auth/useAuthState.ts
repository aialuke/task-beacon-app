/**
 * Auth State Management Hook
 * 
 * Manages authentication state including user, session, loading, and error states.
 * Handles session initialization and state updates.
 */

import { useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { authLogger } from '@/lib/logger';
import { handleAuthError } from '@/lib/auth-utils';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

interface AuthStateActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  updateSessionAndUser: (session: Session | null) => void;
  clearAuthState: () => void;
}

export interface UseAuthStateReturn extends AuthState, AuthStateActions {}

/**
 * Hook for managing authentication state
 */
export function useAuthState(): UseAuthStateReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Update both session and user atomically
  const updateSessionAndUser = useCallback((newSession: Session | null) => {
    try {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      authLogger.debug('Auth state updated', { 
        hasSession: !!newSession, 
        userId: newSession?.user?.id 
      });
    } catch (error) {
      const authError = handleAuthError(error, 'updateSessionAndUser');
      setError(authError);
    }
  }, []);

  // Clear all auth state
  const clearAuthState = useCallback(() => {
    try {
      setUser(null);
      setSession(null);
      setError(null);
      setLoading(false);
      authLogger.debug('Auth state cleared');
    } catch (error) {
      authLogger.error('Failed to clear auth state', error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  return {
    // State
    user,
    session,
    loading,
    error,
    // Actions
    setUser,
    setSession,
    setLoading,
    setError,
    updateSessionAndUser,
    clearAuthState,
  };
} 