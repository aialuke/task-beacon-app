
/**
 * Task Card Components - Phase 4.2 Consolidated
 * 
 * Simplified exports after consolidation - removed duplicate implementations.
 */

// Main task card implementation
export { default as TaskCard } from './TaskCard';

// Legacy aliases (now point to main implementation)
export { default as OptimizedTaskCard } from './OptimizedTaskCard';

// Specialized virtualized version (keeps virtualization features)
export { default as VirtualizedTaskCard } from './VirtualizedTaskCard';

// Task card sub-components
export { default as TaskCardHeader } from './TaskCardHeader';
export { default as TaskCardContent } from './TaskCardContent';
