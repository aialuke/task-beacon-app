/**
 * Simplified Utilities Index
 *
 * Direct exports without over-engineered lazy loading patterns.
 * Consolidated from nested directory structure for better maintainability.
 */

// ============================================================================
// CORE UTILITIES (Always loaded)
// ============================================================================

export * from './core';
export * from './ui';
export * from './data';
export * from './date';
export * from './format';
export * from './shared';

// ============================================================================
// SPECIALIZED UTILITIES
// ============================================================================

export * from './pagination';
export * from './image';
export * from './async';

// ============================================================================
// NAVBAR UTILITIES (Specific to UI components)
// ============================================================================

export * from './navbarColors';
export * from './navbarGeometry';

// ============================================================================
// OTHER UTILITIES
// ============================================================================

export * from './patterns';
export * from './animation';
export * from './createContext';
