import { createContext, useContext, ReactNode } from 'react';

import { useAuth as useAuthHook } from '@/hooks/core';
import type { AuthContextType } from '@/types/shared/auth.types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Note: AuthContext export removed as unused

export function AuthProvider({ children }: AuthProviderProps) {
  // Use the simplified auth hook
  const authState = useAuthHook();

  const contextValue: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signOut: authState.signOut,
    refreshSession: authState.refreshSession,
    signIn: authState.signIn,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
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
