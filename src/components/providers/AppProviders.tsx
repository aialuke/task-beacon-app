// External libraries
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Internal utilities
import { queryClient } from '@/lib/query-client';
import { isFeatureEnabled } from '@/lib/config/app';

// Components
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
              onClick={() => { window.location.reload(); }}
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

/**
 * Performance optimization wrapper - Simplified
 */
function PerformanceOptimizations({ children }: { children: React.ReactNode }) {
  // Basic performance monitoring only
  React.useEffect(() => {
    // Simple connection quality check
    const connection = (navigator as any).connection;
    const connectionQuality = connection?.effectiveType === '4g' || connection?.effectiveType === '3g' ? 'fast' : 'slow';
    console.debug('Connection quality:', connectionQuality);
    
    // Preload critical components on fast connections only
    if (connectionQuality === 'fast') {
      setTimeout(() => {
        import('@/features/tasks/components/lazy').catch(() => {
          // Silently fail preloading
        });
      }, 2000);
    }
  }, []);

  return <>{children}</>;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Centralized provider composition with simplified performance optimizations
 * 
 * Hierarchy (outer to inner):
 * 1. Error handling
 * 2. Performance optimizations
 * 3. Theme/styling
 * 4. Data/caching
 * 5. Authentication
 * 6. UI infrastructure
 * 7. Routing
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppErrorBoundary>
      <PerformanceOptimizations>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <React.Suspense fallback={<PageLoader message="Loading application..." />}>
                    {children}
                  </React.Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </PerformanceOptimizations>
    </AppErrorBoundary>
  );
}
