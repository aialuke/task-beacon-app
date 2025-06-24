import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { TooltipProvider } from '@/components/ui/tooltip';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { queryClient } from '@/lib/query-client';

// Simple loading fallback for React 19 Enhanced Suspense
function AppLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto size-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );
}

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Simplified provider composition for React 19
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UnifiedErrorBoundary variant="page" title="Application Error">
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <React.Suspense fallback={<AppLoadingFallback />}>
                {children}
              </React.Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </UnifiedErrorBoundary>
  );
}
