/**
 * Navigation Utilities - Barrel Export
 * 
 * Centralized navigation abstractions to eliminate direct page imports
 * from feature components and reduce circular dependency risks.
 */

export { useTaskNavigation, type TaskNavigationHook } from './useTaskNavigation';