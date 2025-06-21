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
      // Enable React 19 Enhanced Suspense integration
      suspense: false, // We use useSuspenseQuery explicitly
      throwOnError: true, // Let error boundaries handle errors
    },
  },
});
