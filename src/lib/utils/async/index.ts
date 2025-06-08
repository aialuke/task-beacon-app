
/**
 * Async Operations Utilities - Modular Entry Point
 * 
 * Split from oversized async-operations.ts for better maintainability.
 */

// Core async operation hook
export {
  useAsyncOperation,
  type AsyncOperationState,
  type AsyncOperationOptions,
  type AsyncOperationResult,
} from './useAsyncOperation';

// Batch operations
export { useBatchAsyncOperation } from './useBatchAsyncOperation';

// Optimistic updates
export { useOptimisticAsyncOperation } from './useOptimisticAsyncOperation';

// Factory utilities
export { createAsyncOperationFactory } from './factory';

// Convenience namespace export
export const asyncOperationUtils = {
  useAsyncOperation,
  useBatchAsyncOperation,
  useOptimisticAsyncOperation,
  createAsyncOperationFactory,
};
