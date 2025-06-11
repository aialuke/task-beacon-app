/**
 * Unified Form Validators - Form-Specific Validation Functions
 *
 * Pre-built validators for common form types.
 * Provides convenient validation functions for complete forms.
 */

import { z } from 'zod';

import {
  UnifiedValidationResult,
  validateWithUnifiedSchema,
} from './unified-core';
import {
  unifiedSignInSchema,
  unifiedSignUpSchema,
  unifiedTaskFormSchema,
  unifiedProfileFormSchema,
} from './unified-schemas';

// ============================================================================
// FORM VALIDATION UTILITIES
// ============================================================================

/**
 * Validate sign-in data
 */
export function validateUnifiedSignIn(
  data: unknown
): UnifiedValidationResult<z.infer<typeof unifiedSignInSchema>> {
  return validateWithUnifiedSchema(unifiedSignInSchema, data);
}

/**
 * Validate sign-up data
 */
export function validateUnifiedSignUp(
  data: unknown
): UnifiedValidationResult<z.infer<typeof unifiedSignUpSchema>> {
  return validateWithUnifiedSchema(unifiedSignUpSchema, data);
}

/**
 * Validate task data
 */
export function validateUnifiedTask(
  data: unknown
): UnifiedValidationResult<z.infer<typeof unifiedTaskFormSchema>> {
  return validateWithUnifiedSchema(unifiedTaskFormSchema, data);
}

/**
 * Validate profile data
 */
function validateUnifiedProfile(
  data: unknown
): UnifiedValidationResult<z.infer<typeof unifiedProfileFormSchema>> {
  return validateWithUnifiedSchema(unifiedProfileFormSchema, data);
}
