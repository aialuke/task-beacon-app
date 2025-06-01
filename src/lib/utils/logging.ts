/**
 * Logging utilities
 * 
 * Re-exports logging functionality from the main logger for consistent access.
 * Provides a centralized entry point for all logging needs.
 */

import {
  Logger,
  logger,
  authLogger,
  apiLogger,
  performanceLogger,
  realtimeLogger,
  componentLogger,
  logFunctionCall,
  logAsyncOperation,
  type LogLevel
} from '../logger';

// Re-export everything from the main logger
export {
  Logger,
  logger,
  authLogger,
  apiLogger,
  performanceLogger,
  realtimeLogger,
  componentLogger,
  logFunctionCall,
  logAsyncOperation,
  type LogLevel
};

// Legacy export for backward compatibility
export const loggingUtils = {
  logger,
  authLogger,
  apiLogger,
  performanceLogger,
  realtimeLogger,
  componentLogger,
  logFunctionCall,
  logAsyncOperation,
}; 