import { ValidationResult } from '@/lib/utils/validation';

export function showValidationErrors(result: ValidationResult) {
  return {
    errors: result.errors || [],
    warnings: result.warnings || [],
    isValid: result.isValid,
  };
}
