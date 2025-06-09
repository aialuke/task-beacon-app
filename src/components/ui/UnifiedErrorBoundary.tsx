/**
 * Unified Error Boundary - Phase 1 Consolidation
 * 
 * Single error boundary component that replaces ErrorBoundary.tsx,
 * TaskErrorBoundary.tsx, and AppErrorBoundary with unified behavior.
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/core/ErrorHandler';
import { cn } from '@/lib/utils';

// === INTERFACES ===

interface UnifiedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'page' | 'section' | 'inline';
  title?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

interface UnifiedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// === ERROR BOUNDARY COMPONENT ===

/**
 * Unified error boundary with consistent behavior across all use cases
 */
export class UnifiedErrorBoundary extends Component<
  UnifiedErrorBoundaryProps,
  UnifiedErrorBoundaryState
> {
  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<UnifiedErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Use unified error handler for consistent logging
    handleError(error, {
      context: 'Error Boundary',
      showToast: false, // Don't show toast for boundary errors
      logToConsole: true,
    });

    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <UnifiedErrorUI
          error={this.state.error}
          variant={this.props.variant || 'section'}
          title={this.props.title}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          className={this.props.className}
          showDetails={process.env.NODE_ENV === 'development'}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

// === ERROR UI COMPONENT ===

interface UnifiedErrorUIProps {
  error: Error | null;
  variant: 'page' | 'section' | 'inline';
  title?: string;
  onRetry: () => void;
  onReload: () => void;
  className?: string;
  showDetails?: boolean;
  errorInfo?: React.ErrorInfo | null;
}

/**
 * Consistent error UI across all variants
 */
function UnifiedErrorUI({
  error,
  variant,
  title,
  onRetry,
  onReload,
  className,
  showDetails = false,
  errorInfo,
}: UnifiedErrorUIProps) {
  const variantStyles = {
    page: 'flex min-h-screen items-center justify-center p-8',
    section: 'flex items-center justify-center min-h-[400px] p-8',
    inline: 'flex items-center justify-center min-h-[200px] p-4',
  };

  const contentStyles = {
    page: 'max-w-md space-y-6',
    section: 'max-w-md space-y-4',
    inline: 'max-w-sm space-y-3',
  };

  const iconSize = {
    page: 'w-16 h-16',
    section: 'w-12 h-12',
    inline: 'w-8 h-8',
  };

  const defaultTitle = {
    page: 'Application Error',
    section: 'Something went wrong',
    inline: 'Error occurred',
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      <div className={cn('text-center', contentStyles[variant])}>
        <div className={cn('mx-auto rounded-full bg-destructive/10 flex items-center justify-center', iconSize[variant])}>
          <AlertTriangle className={cn('text-destructive', variant === 'page' ? 'w-8 h-8' : variant === 'section' ? 'w-6 h-6' : 'w-4 h-4')} />
        </div>
        
        <div className="space-y-2">
          <h2 className={cn('font-semibold text-destructive', variant === 'page' ? 'text-2xl' : variant === 'section' ? 'text-lg' : 'text-base')}>
            {title || defaultTitle[variant]}
          </h2>
          <p className={cn('text-muted-foreground', variant === 'page' ? 'text-base' : 'text-sm')}>
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        <div className={cn('flex gap-3 justify-center', variant === 'inline' ? 'flex-col' : 'flex-row')}>
          <Button
            onClick={onRetry}
            variant="default"
            size={variant === 'page' ? 'default' : 'sm'}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          {variant !== 'inline' && (
            <Button
              onClick={onReload}
              variant="outline"
              size={variant === 'page' ? 'default' : 'sm'}
            >
              Reload Page
            </Button>
          )}
        </div>

        {/* Development error details */}
        {showDetails && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all max-h-40 overflow-auto">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              <div className="mb-2">
                <strong>Stack:</strong> {error.stack}
              </div>
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  {errorInfo.componentStack}
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// === HIGHER-ORDER COMPONENT ===

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

// === EXPORTS ===

export default UnifiedErrorBoundary; 