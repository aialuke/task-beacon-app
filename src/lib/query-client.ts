import { QueryClient } from '@tanstack/react-query';

import { getCacheConfig, getApiConfig } from '@/lib/config/app';

// Create optimized query client using centralized configuration
const cacheConfig = getCacheConfig();
const apiConfig = getApiConfig();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: apiConfig.retryAttempts,
      staleTime: cacheConfig.staleTime,
      refetchOnWindowFocus: true,
      refetchInterval: cacheConfig.refetchInterval,
    },
  },
});

/**
 * Hook to access the query client instance
 * Useful for programmatic query operations
 */
export function useQueryClient() {
  return queryClient;
} 