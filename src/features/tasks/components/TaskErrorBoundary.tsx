
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Task Error Boundary - Enhanced with Mobile Debugging
 * 
 * Provides standardized error handling for task-related components
 * with recovery actions and proper error reporting.
 */
export class TaskErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging for mobile debugging
    console.error('TaskErrorBoundary caught an error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    console.log('TaskErrorBoundary: Retrying after error');
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    console.log('TaskErrorBoundary: Reloading page after error');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with enhanced mobile debugging
      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground">
                An error occurred while loading this section. Please try again.
              </p>
            </div>

            {/* Show simplified error details for all environments to help with mobile debugging */}
            {this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-md text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all max-h-40 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>User Agent:</strong> {navigator.userAgent}
                  </div>
                  <div className="mb-2">
                    <strong>URL:</strong> {window.location.href}
                  </div>
                  <div className="mb-2">
                    <strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                size="sm"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with TaskErrorBoundary
 */
export function withTaskErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
) {
  const WrappedComponent = (props: T) => (
    <TaskErrorBoundary fallback={options?.fallback} onError={options?.onError}>
      <Component {...props} />
    </TaskErrorBoundary>
  );

  WrappedComponent.displayName = `withTaskErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
