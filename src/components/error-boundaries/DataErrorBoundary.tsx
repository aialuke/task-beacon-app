import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Database } from 'lucide-react';
import { logger } from '@/lib/logger';

interface DataErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface DataErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
  onRetry?: () => void;
  onGoBack?: () => void;
  dataType?: string; // e.g., "tasks", "users", "projects"
  showGoBack?: boolean;
  showRefresh?: boolean;
}

/**
 * Generic data error boundary for API and data loading errors
 * 
 * Provides common recovery options:
 * - Retry the failed operation
 * - Go back to previous page
 * - Refresh the page
 * - Clear cached data
 */
export class DataErrorBoundary extends Component<
  DataErrorBoundaryProps,
  DataErrorBoundaryState
> {
  state: DataErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): DataErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = `${error.message}\n${error.stack}\n${errorInfo.componentStack}`;
    
    // Use centralized logger
    logger.error('Data Loading Error', error, {
      feature: 'data',
      dataType: this.props.dataType || 'unknown',
      errorInfo: errorDetails,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      error,
      errorInfo: errorDetails,
    });

    if (this.props.onError) {
      this.props.onError(error, errorDetails);
    }
  }

  private handleRetry = () => {
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    } else {
      window.history.back();
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleClearCache = () => {
    // Clear React Query cache
    try {
      const queryClient = (window as { __REACT_QUERY_CLIENT__?: unknown }).__REACT_QUERY_CLIENT__;
      if (queryClient && this.props.dataType) {
        // Type assertion for the specific method we need
        const client = queryClient as { removeQueries?: (options: { queryKey: string[] }) => void };
        client.removeQueries?.({ queryKey: [this.props.dataType] });
      }
    } catch (e) {
      logger.warn('Failed to clear query cache', { error: (e as Error).message });
    }

    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { dataType = 'data', showGoBack = true, showRefresh = true } = this.props;

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <div className="max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <Database className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Unable to Load {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                There was a problem loading the {dataType}. This might be due to a 
                network issue, server problem, or corrupted data.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                {showGoBack && (
                  <button
                    onClick={this.handleGoBack}
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </button>
                )}
                
                {showRefresh && (
                  <button
                    onClick={this.handleRefresh}
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                )}
              </div>

              <button
                onClick={this.handleClearCache}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <Database className="h-4 w-4" />
                Clear Cache & Retry
              </button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Error Details (Dev)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                  {this.state.error.message}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nStack:'}
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