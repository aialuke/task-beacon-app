/**
 * Authentication Utilities
 *
 * Utility functions for authentication state management, storage cleanup,
 * and auth-related operations.
 */

import { authLogger } from '@/lib/logger';

/**
 * Storage key patterns for Supabase auth data
 */
const AUTH_STORAGE_PATTERNS = ['supabase.auth.', 'sb-'] as const;

/**
 * Cleans up all authentication-related data from browser storage
 * Removes both localStorage and sessionStorage items
 */
export const cleanupAuthState = (): void => {
  try {
    // Clean localStorage
    Object.keys(localStorage).forEach(key => {
      if (
        AUTH_STORAGE_PATTERNS.some(
          pattern => key.startsWith(pattern) || key.includes(pattern)
        )
      ) {
        localStorage.removeItem(key);
      }
    });

    // Clean sessionStorage
    Object.keys(sessionStorage || {}).forEach(key => {
      if (
        AUTH_STORAGE_PATTERNS.some(
          pattern => key.startsWith(pattern) || key.includes(pattern)
        )
      ) {
        sessionStorage.removeItem(key);
      }
    });

    authLogger.debug('Auth storage cleanup completed');
  } catch (error) {
    authLogger.error(
      'Failed to cleanup auth storage',
      error instanceof Error ? error : new Error(String(error))
    );
  }
};

/**
 * Checks if there's any auth data in storage
 */
export const hasAuthDataInStorage = (): boolean => {
  try {
    const localStorageKeys = Object.keys(localStorage);
    const sessionStorageKeys = Object.keys(sessionStorage || {});

    return [...localStorageKeys, ...sessionStorageKeys].some(key =>
      AUTH_STORAGE_PATTERNS.some(
        pattern => key.startsWith(pattern) || key.includes(pattern)
      )
    );
  } catch (error) {
    authLogger.warn('Failed to check auth storage', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
};

/**
 * Type guard for checking if an error is an auth-related error
 */
export const isAuthError = (error: unknown): error is Error => {
  return (
    error instanceof Error &&
    (error.message.includes('auth') ||
      error.message.includes('unauthorized') ||
      error.message.includes('session') ||
      error.message.includes('token'))
  );
};

/**
 * Safely handles auth operation errors with consistent logging
 */
export const handleAuthError = (error: unknown, operation: string): Error => {
  const authError =
    error instanceof Error ? error : new Error(`${operation} failed`);
  authLogger.error(`Auth operation failed: ${operation}`, authError);
  return authError;
};
