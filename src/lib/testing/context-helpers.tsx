import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React from 'react';

import { createTestQueryClient } from './test-context-utils';

// Re-export for convenience
export { createTestQueryClient } from './test-context-utils';

/**
 * Creates a wrapper component with providers for testing
 */
export function createTestWrapper(options: { queryClient?: QueryClient } = {}) {
  const queryClient = options.queryClient || createTestQueryClient();
  
  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

/**
 * Test providers component
 */
export function TestProviders({ 
  children, 
  queryClient 
}: { 
  children: React.ReactNode;
  queryClient?: QueryClient;
}) {
  const client = queryClient || createTestQueryClient();
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Enhanced render function with providers and query client access
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: { queryClient?: QueryClient } & Omit<RenderOptions, 'wrapper'> = {}
): RenderResult & { queryClient: QueryClient } {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;
  
  const Wrapper = createTestWrapper({ queryClient });
  
  const renderResult = render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
  
  return {
    ...renderResult,
    queryClient,
  };
}
