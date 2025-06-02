import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/lib/api';
import { authLogger } from '@/lib/logger';
import { toast } from '@/lib/toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Clean up auth state utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Refresh session function using AuthService
  const refreshSession = async () => {
    try {
      const response = await AuthService.refreshSession();
      
      if (response.success) {
        setSession(response.data?.session ?? null);
        setUser(response.data?.user ?? null);
        authLogger.info('Session refreshed successfully via AuthService');
      } else {
        authLogger.warn('AuthService refresh failed, attempting direct refresh', { error: response.error?.message });
        // Fallback to direct Supabase refresh
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;

        setSession(data.session);
        setUser(data.session?.user ?? null);
        authLogger.info('Session refreshed successfully via fallback');
      }
    } catch (error: unknown) {
      authLogger.error('Session refresh failed', error as Error);
      if (error instanceof Error) {
        setError(error);
      }
    }
  };

  // Sign out function with enhanced cleanup using AuthService
  const signOut = async () => {
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
        authLogger.warn('AuthService sign out failed, attempting direct sign out', { error: response.error?.message });
        // Fallback to direct sign out
        await supabase.auth.signOut({ scope: 'global' });
      }

      // Clear local state
      setUser(null);
      setSession(null);
      setError(null);

      toast.success('Signed out successfully');
      authLogger.info('Sign out completed successfully');

      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
    } catch (error: unknown) {
      authLogger.error('Sign out failed', error as Error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      authLogger.debug('Auth state change detected', { 
        event, 
        userId: session?.user?.id,
        hasSession: !!session 
      });

      if (!mounted) return;

      // Update session and user state
      setSession(session);
      setUser(session?.user ?? null);

      // Handle different auth events
      if (event === 'SIGNED_IN' && session?.user) {
        // Defer any additional data fetching to prevent deadlocks
        setTimeout(() => {
          if (mounted) {
            setError(null);
            setLoading(false);
            authLogger.info('User signed in successfully', { userId: session.user.id });
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setError(null);
        setLoading(false);
        authLogger.info('User signed out');
      } else if (event === 'TOKEN_REFRESHED') {
        authLogger.debug('Auth token refreshed');
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        authLogger.debug('Initializing auth state');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          authLogger.error('Error getting session', error);
          setError(error);
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            authLogger.info('Existing session found', { userId: session.user.id });
          } else {
            authLogger.debug('No existing session found');
          }
        }
      } catch (error: unknown) {
        authLogger.error('Auth initialization failed', error as Error);
        if (mounted && error instanceof Error) {
          setError(error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          authLogger.debug('Auth initialization completed');
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      authLogger.debug('Auth context cleanup completed');
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Export the useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
