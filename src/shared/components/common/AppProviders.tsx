import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { isFeatureEnabled } from '@/lib/config/app';
import { queryClient } from '@/lib/query-client';
import { PageLoader } from '@/shared/components/ui/loading/UnifiedLoadingStates';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import UnifiedErrorBoundary from '@/shared/components/ui/UnifiedErrorBoundary';
// AuthProvider removed - using direct useAuth hook instead

// Type for the Network Information API
interface NetworkConnection {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
}

/**
 * Performance optimization wrapper - Simplified
 */
function PerformanceOptimizations({ children }: { children: React.ReactNode }) {
  // Basic performance monitoring only
  React.useEffect(() => {
    // Simple connection quality check
    const connection = (navigator as NavigatorWithConnection).connection;
    const connectionQuality =
      connection?.effectiveType === '4g' || connection?.effectiveType === '3g'
        ? 'fast'
        : 'slow';
    console.debug('Connection quality:', connectionQuality);

    // Preload critical components on fast connections only
    if (connectionQuality === 'fast') {
      // Note: Lazy component preloading removed - components are now directly imported
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
    <UnifiedErrorBoundary variant="page" title="Application Error">
      <PerformanceOptimizations>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BrowserRouter>
                <React.Suspense
                  fallback={<PageLoader message="Loading application..." />}
                >
                  {children}
                </React.Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </PerformanceOptimizations>
    </UnifiedErrorBoundary>
  );
}
