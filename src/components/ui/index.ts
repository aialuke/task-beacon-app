
/**
 * UI Components Index - Phase 4 Updated
 * 
 * Consolidated exports with unified loading states.
 */

// === CORE UI COMPONENTS (Used exports only) ===
// Note: Removed all unused re-exports to reduce API surface

// === BUTTON & BADGE ===
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';
export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';

// === PAGINATION ===
export { default as GenericPagination } from './GenericPagination';

// === IMAGE COMPONENTS ===
export { default as ImageLoadingState } from './ImageLoadingState';
export { default as ImageErrorFallback } from './ImageErrorFallback';
