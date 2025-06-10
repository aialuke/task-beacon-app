import { QueryClient } from '@tanstack/react-query';

// Static configuration for better performance (no dynamic imports)
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: false,
  retryAttempts: 3,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_CONFIG.retryAttempts,
      staleTime: QUERY_CONFIG.staleTime,
      refetchOnWindowFocus: true,
      refetchInterval: QUERY_CONFIG.refetchInterval,
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