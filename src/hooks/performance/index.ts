/**
 * Performance Hooks Index - Phase 2.4 Revised
 * 
 * Simplified exports - use standard React hooks for most cases.
 * Only use these for proven performance bottlenecks.
 */

export { 
  memoizeComponent,
  useMemoizedComputation,
  useMemoizedCallback,
  createShallowEqual,
  createDeepEqual,
} from './memoization';

// Keep backward compatibility but discourage overuse
// Use standard useMemo/useCallback for simple operations
export { 
  useOptimizedMemo,
  useOptimizedCallback 
} from './memo';
