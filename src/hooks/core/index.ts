/**
 * Core Hooks Index
 * Central exports for core application hooks
 */

export { useAuth } from './auth';
export { useErrorHandler } from './error';
export { useSubmissionState, useImageLoadingState } from './useLoadingState';

// === ENTITY QUERY CONSOLIDATION ===
export { useEntityByIdQuery, useEntityListQuery } from './useEntityQuery';
// === UNIFIED FORM CONSOLIDATION ===
export { useUnifiedForm } from './useUnifiedForm';
