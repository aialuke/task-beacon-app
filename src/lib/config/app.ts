
/**
 * Application Configuration
 */

interface FeatureFlags {
  enableBundleOptimization: boolean;
}

const features: FeatureFlags = {
  enableBundleOptimization: false,
};

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return features[feature] || false;
}
