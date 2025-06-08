
/**
 * Async Operations Utilities - Simplified Entry Point
 * 
 * Removed over-engineered patterns: batch operations, optimistic updates, factory utilities.
 * Focus on core async operation hook only.
 */

// Core async operation hook only
export {
  useAsyncOperation,
  type AsyncOperationOptions,
  type AsyncOperationResult,
} from './useAsyncOperation';

// Simple convenience export
export const asyncOperationUtils = {
  useAsyncOperation,
};
