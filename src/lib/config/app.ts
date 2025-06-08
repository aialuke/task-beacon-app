
/**
 * Application Configuration
 */

interface FeatureFlags {
  enableBundleOptimization: boolean;
}

interface CacheConfig {
  staleTime: number;
  refetchInterval: number | false;
}

interface ApiConfig {
  retryAttempts: number;
}

const features: FeatureFlags = {
  enableBundleOptimization: false,
};

const cacheConfig: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: false,
};

const apiConfig: ApiConfig = {
  retryAttempts: 3,
};

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return features[feature] || false;
}

export function getCacheConfig(): CacheConfig {
  return cacheConfig;
}

export function getApiConfig(): ApiConfig {
  return apiConfig;
}
