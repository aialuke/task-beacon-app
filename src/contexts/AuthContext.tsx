import { createContext, ReactNode } from 'react';

import { useAuth as useAuthHook } from '@/hooks/core';
import type { AuthContextType } from '@/types/shared/auth.types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
