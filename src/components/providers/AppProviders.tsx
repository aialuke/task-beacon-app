import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LoadingSpinner } from '@/components/ui/layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Create optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
      refetchInterval: 30000, // 30 seconds for active queries
    },
  },
});

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component using React class component pattern
 */
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary:', error, errorInfo);
    // Add error reporting here (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Centralized provider composition following the recommended hierarchy
 * 
 * Hierarchy (outer to inner):
 * 1. Error handling
 * 2. Theme/styling
 * 3. Data/caching
 * 4. Authentication
 * 5. UI infrastructure
 * 6. Routing
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <React.Suspense fallback={<LoadingSpinner />}>
                  {children}
                  <Toaster />
                </React.Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

/**
 * Hook to access the query client instance
 * Useful for programmatic query operations
 */
export function useQueryClient() {
  return queryClient;
} 