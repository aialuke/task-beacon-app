import { ReactNode } from 'react';

import { useAuth } from '@/hooks/core';

interface AuthenticatedAppProps {
  /**
   * Component to show while authentication state is loading
   */
  loadingComponent: ReactNode;

  /**
   * Component to show when user is authenticated
   */
  authenticatedComponent: ReactNode;

  /**
   * Component to show when user is not authenticated
   */
  unauthenticatedFallback: ReactNode;
}

/**
 * Authentication-aware app wrapper
 *
 * This component handles the authentication state logic and conditional
 * rendering based on auth status, removing this responsibility from
 * page components to follow separation of concerns.
 *
 * Benefits:
 * - Pages focus only on layout
 * - Authentication logic is centralized and reusable
 * - Easier to test and maintain
 * - Clear separation between layout and business logic
 */
export function AuthenticatedApp({
  loadingComponent,
  authenticatedComponent,
  unauthenticatedFallback,
}: AuthenticatedAppProps) {
  const { user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return <>{loadingComponent}</>;
  }

  // Show authenticated content if user is logged in
  if (user) {
    return <>{authenticatedComponent}</>;
  }

  // Show unauthenticated fallback for guests
  return <>{unauthenticatedFallback}</>;
}
