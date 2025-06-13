/**
 * Shared API Hooks - Service Abstraction Layer
 *
 * Centralized exports for data access hooks that abstract service calls.
 * Provides consistent interfaces for components to interact with APIs.
 */

export { usePhotoUpload } from './usePhotoUpload';

// Error handling utilities
export {
  handleDataAccessError,
  handleDataAccessSuccess,
  withDataAccessErrorHandling,
  isDataAccessError,
  createErrorHandler,
  ErrorPatterns,
} from './useErrorHandling';

// Re-export types for convenience
export type { PhotoUploadResult } from './usePhotoUpload';

export type {
  DataAccessErrorOptions,
  DataAccessErrorResult,
} from './useErrorHandling';
