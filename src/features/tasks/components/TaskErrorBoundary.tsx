
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/logger';

interface TaskErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface TaskErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
  onNavigateHome?: () => void;
}

/**
 * Feature-specific error boundary for task-related components
 * 
 * Provides task-specific error handling with contextual recovery options:
 * - Retry the failed operation
 * - Navigate back to task list
 * - Clear local task data
 */
export class TaskErrorBoundary extends Component<
  TaskErrorBoundaryProps,
  TaskErrorBoundaryState
> {
  state: TaskErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): TaskErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = `${error.message}\n${error.stack}\n${errorInfo.componentStack}`;
    
    // Use centralized logger
    logger.error('Task Feature Error', error, {
      feature: 'tasks',
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
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleNavigateHome = () => {
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  private handleClearTaskData = () => {
    // Clear React Query cache for tasks
    try {
      const queryClient = (window as Window & { __REACT_QUERY_CLIENT__?: unknown }).__REACT_QUERY_CLIENT__;
      if (queryClient && typeof queryClient === 'object' && queryClient !== null) {
        const client = queryClient as { 
          removeQueries: (options: { queryKey: string[] }) => void 
        };
        client.removeQueries({ queryKey: ['tasks'] });
        client.removeQueries({ queryKey: ['task'] });
      }
    } catch (e) {
      logger.warn('Failed to clear query cache', { error: (e as Error).message });
    }

    // Clear local storage
    try {
      localStorage.removeItem('task-filter');
      localStorage.removeItem('task-ui-state');
    } catch (e) {
      logger.warn('Failed to clear local storage', { error: (e as Error).message });
    }

    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <div className="max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Task Loading Error
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                There was a problem loading your tasks. This might be due to a 
                network issue or temporary server problem.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="flex w-full items-center justify-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={this.handleNavigateHome}
                  className="flex flex-1 items-center justify-center gap-2 border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Home
                </button>
                
                <button
                  onClick={this.handleClearTaskData}
                  className="flex flex-1 items-center justify-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Data
                </button>
              </div>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Error Details (Dev)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
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
