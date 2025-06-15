/**
 * Unified Validation System - Main Entry Point
 *
 * Single source of truth for all validation patterns.
 * Consolidates scattered validation logic into a unified API.
 */

// ============================================================================
// CORE VALIDATION SYSTEM
// ============================================================================

// New modular validation system
export * from './messages';
export * from './unified-schemas';
export * from './unified-core';
export * from './unified-hooks';
export * from './unified-forms';

// Legacy support
export * from './schemas';
export * from './validators';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// Core schemas
export { profileUpdateSchema } from './schemas';

// Core validators
export { validateProfileUpdate } from './validators';

// Core validation utilities from new modules
export { useUnifiedValidation } from './unified-hooks';
export {
  validateUnifiedTask,
  validateUnifiedSignIn,
  validateUnifiedSignUp,
} from './unified-forms';
// Helper functions
// ============================================================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================================================

// For backward compatibility with existing imports
// Legacy schema aliases
// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { ProfileUpdateInput } from './schemas';
export type {
  UnifiedValidationResult,
  ProfileValidationResult,
  ValidationResult,
  ZodValidationResult,
} from './unified-core';

// Profile schema re-exports
export {
  unifiedProfileSchema,
  unifiedProfileCreateSchema,
  unifiedProfileUpdateSchema,
  unifiedProfileFormSchema,
} from './unified-schemas';
