
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

// Import for convenience namespace
import { useAsyncOperation } from './useAsyncOperation';
import { useBatchAsyncOperation } from './useBatchAsyncOperation';
import { useOptimisticAsyncOperation } from './useOptimisticAsyncOperation';
import { createAsyncOperationFactory } from './factory';

// Convenience namespace export
export const asyncOperationUtils = {
  useAsyncOperation: useAsyncOperation,
  useBatchAsyncOperation: useBatchAsyncOperation,
  useOptimisticAsyncOperation: useOptimisticAsyncOperation,
  createAsyncOperationFactory: createAsyncOperationFactory,
};
