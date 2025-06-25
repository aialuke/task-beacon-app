/**
 * Unified Async State Interfaces - Phase 1 Consolidation
 *
 * Shared base interfaces to eliminate duplication across async operations.
 */

/**
 * Base async state interface - shared foundation
 */
export interface BaseAsyncState<T = unknown, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  lastUpdated: number | null;
}
