// External libraries
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Components
import { PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UnifiedErrorBoundary } from '@/components/ui/UnifiedErrorBoundary';
// Contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { MotionPreferenceProvider } from '@/contexts/MotionPreferenceContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
// Utilities
import { queryClient } from '@/lib/query-client';

// Type definition for Navigator connection property
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkInformation;
}

/**
 * Performance optimization wrapper - Simplified
 */
function PerformanceOptimizations({ children }: { children: React.ReactNode }) {
  // Basic performance monitoring only
  React.useEffect(() => {
    // Simple connection quality check
    const connection = (navigator as ExtendedNavigator).connection;
    const connectionQuality = connection?.effectiveType === '4g' || connection?.effectiveType === '3g' ? 'fast' : 'slow';
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
 * 4. Motion preferences (accessibility)
 * 5. Data/caching
 * 6. Authentication
 * 7. UI infrastructure
 * 8. Routing
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UnifiedErrorBoundary variant="page" title="Application Error">
      <PerformanceOptimizations>
        <ThemeProvider>
          <MotionPreferenceProvider>
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
          </MotionPreferenceProvider>
        </ThemeProvider>
      </PerformanceOptimizations>
    </UnifiedErrorBoundary>
  );
}
