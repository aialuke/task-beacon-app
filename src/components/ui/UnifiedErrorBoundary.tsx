/**
 * Unified Error Boundary - React 19 Optimized
 *
 * Simplified error boundary leveraging React 19 enhanced error handling.
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';
import React, { Component, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
}

class UnifiedErrorBoundary extends Component<
  UnifiedErrorBoundaryProps,
  UnifiedErrorBoundaryState
> {
  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): UnifiedErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          variant={this.props.variant ?? 'section'}
          title={this.props.title}
          onRetry={this.handleRetry}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  variant: 'page' | 'section' | 'inline';
  title?: string;
  onRetry: () => void;
  className?: string;
}

function ErrorDisplay({
  error,
  variant,
  title,
  onRetry,
  className,
}: ErrorDisplayProps) {
  const isPage = variant === 'page';
  const isInline = variant === 'inline';

  return (
    <div
      className={cn(
        'flex items-center justify-center text-center',
        isPage
          ? 'min-h-screen p-8'
          : isInline
            ? 'min-h-[200px] p-4'
            : 'min-h-[400px] p-8',
        className,
      )}
    >
      <div className={cn('space-y-4', isPage ? 'max-w-md' : 'max-w-sm')}>
        <div
          className={cn(
            'mx-auto flex items-center justify-center rounded-full bg-destructive/10',
            isPage ? 'size-16' : isInline ? 'size-8' : 'size-12',
          )}
        >
          <AlertTriangle
            className={cn(
              'text-destructive',
              isPage ? 'size-8' : isInline ? 'size-4' : 'size-6',
            )}
          />
        </div>

        <div className="space-y-2">
          <h2
            className={cn(
              'font-semibold text-destructive',
              isPage ? 'text-2xl' : isInline ? 'text-base' : 'text-lg',
            )}
          >
            {title ??
              (isPage
                ? 'Application Error'
                : isInline
                  ? 'Error occurred'
                  : 'Something went wrong')}
          </h2>
          <p
            className={cn(
              'text-muted-foreground',
              isPage ? 'text-base' : 'text-sm',
            )}
          >
            {error?.message ??
              'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        <div
          className={cn(
            'flex justify-center gap-3',
            isInline ? 'flex-col' : 'flex-row',
          )}
        >
          <Button
            onClick={onRetry}
            size={isPage ? 'default' : 'sm'}
            className="flex items-center gap-2"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          {!isInline && (
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size={isPage ? 'default' : 'sm'}
            >
              Reload Page
            </Button>
          )}
        </div>

        {/* Development error details */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground active:text-foreground">
              Error Details
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default UnifiedErrorBoundary;
