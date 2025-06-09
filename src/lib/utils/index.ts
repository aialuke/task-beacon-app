
/**
 * Centralized utilities index - Phase 1.4 Bundle Optimization
 * 
 * Optimized for tree shaking and reduced initial bundle size.
 * Heavy utilities are now lazy-loaded to improve performance.
 */

// =====================================================
// ESSENTIAL UTILITIES (Always loaded)
// =====================================================

// Core utilities that are needed immediately
export * from './core';
export * from './ui';
export * from './data';

// =====================================================
// FREQUENTLY USED UTILITIES
// =====================================================

// Date and time utilities (commonly used)
export * from './date';
export * from './format';

// === VALIDATION UTILITIES ===
// NOTE: Validation utilities removed - use unified validation system directly

// =====================================================
// LAZY-LOADED UTILITIES (Loaded on demand)
// =====================================================

// NOTE: Lazy-loaded utility exports removed as unused

// =====================================================
// HEAVY UTILITIES (Lazy loaded)
// =====================================================

// NOTE: Image utilities exports removed as unused

// =====================================================
// NAMESPACE EXPORTS (Optimized)
// =====================================================

// Essential namespaces (immediately available)
export * as dateUtils from './date';
export * as uiUtils from './ui';
export * as dataUtils from './data';
export * as formatUtils from './format';

// NOTE: Lazy namespace loaders and bundle info removed as unused
