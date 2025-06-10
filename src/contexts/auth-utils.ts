import { useContext } from 'react';

import type { AuthContextType } from '@/types/shared/auth.types';

// Import the AuthContext from the main context file
import { AuthContext } from './AuthContext';

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