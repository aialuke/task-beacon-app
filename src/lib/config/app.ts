/**
 * Application Configuration
 */

// Feature flags interface removed - no active feature flags

interface CacheConfig {
  staleTime: number;
  refetchInterval: number | false;
}

interface ApiConfig {
  retryAttempts: number;
}

// Feature flags removed - no active feature flags

const cacheConfig: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: false,
};

const apiConfig: ApiConfig = {
  retryAttempts: 3,
};

// Feature flag function removed - no active feature flags

export function getCacheConfig(): CacheConfig {
  return cacheConfig;
}

export function getApiConfig(): ApiConfig {
  return apiConfig;
}
