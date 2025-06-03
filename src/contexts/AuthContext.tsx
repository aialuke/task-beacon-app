/**
 * Authentication Context
 * 
 * Simplified auth context that orchestrates the various auth hooks.
 * Provides authentication state and operations to the application.
 */

import { createContext, useContext, ReactNode } from 'react';
import type { AuthContextType } from '@/types/shared/auth.types';
import { 
  useAuthState, 
  useAuthOperations, 
  useAuthListener, 
  useAuthInitialization 
} from '@/hooks/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  // Use auth state management hook
  const authState = useAuthState();
  
  // Use auth operations hook
  const authOperations = useAuthOperations({
    setLoading: authState.setLoading,
    setError: authState.setError,
    setUser: authState.setUser,
    setSession: authState.setSession,
  });

  // Set up auth listener
  useAuthListener({
    updateSessionAndUser: authState.updateSessionAndUser,
    setError: authState.setError,
    setLoading: authState.setLoading,
  });

  // Initialize auth state
  useAuthInitialization();

  const contextValue: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signOut: authOperations.signOut,
    refreshSession: authOperations.refreshSession,
    signIn: authOperations.signIn,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook for accessing authentication context
 * Must be used within an AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
