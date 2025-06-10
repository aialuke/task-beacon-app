import React, { ReactNode } from 'react';

import UnifiedErrorBoundary from './UnifiedErrorBoundary';

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    variant?: 'page' | 'section' | 'inline';
    title?: string;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
) {
  const WrappedComponent = (props: T) => (
    <UnifiedErrorBoundary {...options}>
      <Component {...props} />
    </UnifiedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
} 