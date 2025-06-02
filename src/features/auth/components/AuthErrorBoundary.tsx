import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { logger } from '@/lib/logger';

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface AuthErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
  onRetryAuth?: () => void;
  onNavigateToLogin?: () => void;
}

/**
 * Feature-specific error boundary for auth-related components
 * 
 * Provides auth-specific error handling with contextual recovery options:
 * - Retry authentication
 * - Clear auth state and redirect to login
 * - Refresh the page
 */
export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  state: AuthErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = `${error.message}\n${error.stack}\n${errorInfo.componentStack}`;
    
    // Use centralized logger
    logger.error('Auth Feature Error', error, {
      feature: 'auth',
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

  private handleClearAuthAndLogin = () => {
    // Clear all auth-related data
    try {
      // Clear localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('auth')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      logger.warn('Failed to clear auth storage', { error: (e as Error).message });
    }

    if (this.props.onNavigateToLogin) {
      this.props.onNavigateToLogin();
    } else {
      window.location.href = '/auth';
    }
  };

  private handleRefreshPage = () => {
    window.location.reload();
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
                Authentication Error
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                There was a problem with the authentication system. This might be due to 
                expired credentials or a temporary server issue.
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
              
              <div className="flex gap-2">
                <button
                  onClick={this.handleClearAuthAndLogin}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                
                <button
                  onClick={this.handleRefreshPage}
                  className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
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