// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging and reporting
    const errorDetails = `${error.message}\n${error.stack}\n${errorInfo.componentStack}`;
    
    // Log error to console for development
    console.error('ErrorBoundary caught an error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo: errorDetails,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorDetails);
    }

    // In production, you might want to report to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
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

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="max-w-md text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-destructive">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                Reload Page
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                  {this.state.error.message}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo}
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
