/**
 * Performance Hooks Index - Phase 2.1 Updated
 * Central exports for performance optimization hooks
 */

export { 
  memoizeComponent,
  useMemoizedComputation,
  useMemoizedCallback,
  createShallowEqual,
  createDeepEqual,
} from './memoization';

// Keep backward compatibility
export { 
  useOptimizedMemo,
  useOptimizedCallback 
} from './memo';
