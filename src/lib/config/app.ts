
/**
 * Application Configuration
 * 
 * Centralized configuration for the entire application.
 * Contains environment-based settings, feature flags, and app constants.
 */

interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  api: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    apiTimeout: number;
    retryAttempts: number;
  };
  features: {
    enableRealtimeUpdates: boolean;
    enableHapticFeedback: boolean;
    enableBrowserNotifications: boolean;
    enableBundleOptimization: boolean;
    enableImageOptimization: boolean;
  };
  ui: {
    defaultPageSize: number;
    maxImageSize: number;
    animationDuration: number;
    toastTimeout: number;
  };
  cache: {
    staleTime: number;
    refetchInterval: number;
  };
  performance: {
    enableLazyLoading: boolean;
    preloadCriticalRoutes: boolean;
    optimizeImages: boolean;
    enableCSSOptimization: boolean;
  };
}

/**
 * Get the current environment
 */
function getEnvironment(): AppConfig['app']['environment'] {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    const env = process.env.NODE_ENV;
    if (env === 'production' || env === 'test') {
      return env;
    }
  }
  return 'development';
}

/**
 * App configuration object
 */
export const appConfig: AppConfig = {
  app: {
    name: 'Task Beacon',
    version: '1.0.0',
    environment: getEnvironment(),
  },
  api: {
    // Use the actual Supabase configuration values
    supabaseUrl: 'https://wkossxqvqntqhzdiyfdn.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrb3NzeHF2cW50cWh6ZGl5ZmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODYzMTgsImV4cCI6MjA2MzA2MjMxOH0.cOtb4R51ffsp70R3TR16bMAHeO1WFnnAzsGSeCkp5RM',
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 3,
  },
  features: {
    enableRealtimeUpdates: true,
    enableHapticFeedback: true,
    enableBrowserNotifications: true,
    enableBundleOptimization: getEnvironment() === 'production',
    enableImageOptimization: true,
  },
  ui: {
    defaultPageSize: 20,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    animationDuration: 300,
    toastTimeout: 5000,
  },
  cache: {
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 30000, // 30 seconds
  },
  performance: {
    enableLazyLoading: true,
    preloadCriticalRoutes: getEnvironment() === 'production',
    optimizeImages: true,
    enableCSSOptimization: getEnvironment() === 'production',
  },
};

/**
 * Environment-specific helper functions
 */
export const isDevelopment = () => appConfig.app.environment === 'development';
export const isProduction = () => appConfig.app.environment === 'production';
export const isTest = () => appConfig.app.environment === 'test';

/**
 * Feature flag helpers
 */
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return appConfig.features[feature];
};

/**
 * Performance flag helpers
 */
export const isPerformanceEnabled = (feature: keyof AppConfig['performance']): boolean => {
  return appConfig.performance[feature];
};

/**
 * Get API configuration
 */
export const getApiConfig = () => appConfig.api;

/**
 * Get UI configuration
 */
export const getUIConfig = () => appConfig.ui;

/**
 * Get cache configuration
 */
export const getCacheConfig = () => appConfig.cache;

/**
 * Get performance configuration
 */
export const getPerformanceConfig = () => appConfig.performance;
