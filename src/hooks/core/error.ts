/**
 * Legacy Error Hook - Phase 1 Consolidation
 *
 * Re-exports the unified error hook for backward compatibility.
 * Use useUnifiedError directly for new code.
 */

export { useUnifiedError as useErrorHandler } from './useUnifiedError';
export type {
  ErrorOptions as UseErrorHandlerOptions,
  ErrorState,
} from '@/lib/core/ErrorHandler';
