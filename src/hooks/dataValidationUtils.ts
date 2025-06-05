
/**
 * Data Validation Utilities - Phase 4 Consolidation
 * 
 * Consolidated to use unified validation system and eliminate duplication.
 */

// === INTERNAL UTILITIES ===
import { 
  validateForm,
  validateField,
  type ValidationResult as UtilValidationResult 
} from '@/lib/utils/validation';

/**
 * Shows validation errors using consolidated validation system
 */
export function showValidationErrors(result: UtilValidationResult) {
  return {
    errors: result.errors || [],
    warnings: result.warnings || [],
    isValid: result.isValid,
  };
}

/**
 * Validates data and returns formatted errors for display
 */
export function validateAndShowErrors(data: Record<string, unknown>) {
  const validationResult = validateForm(data, {});
  
  // Convert the form validation result to the expected format
  const errors: string[] = [];
  if (!validationResult.isValid) {
    Object.values(validationResult.errors).forEach(fieldErrors => {
      errors.push(...fieldErrors);
    });
  }
  
  return showValidationErrors({
    isValid: validationResult.isValid,
    errors,
    warnings: [],
  });
}
