/**
 * Task Card Components - Phase 2 Consolidated
 * 
 * Simplified exports after removing duplicate implementations.
 */

// Main task card implementation
export { default as TaskCard } from './TaskCard';

// Simplified optimized version (now just extends TaskCard)
export { default as OptimizedTaskCard } from './OptimizedTaskCard';

// Specialized virtualized version (keeps virtualization features)
export { default as VirtualizedTaskCard } from './VirtualizedTaskCard';

// Task card sub-components
export { default as TaskCardHeader } from './TaskCardHeader';
export { default as TaskCardContent } from './TaskCardContent';
