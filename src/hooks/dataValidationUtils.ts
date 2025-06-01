import { ValidationResult } from '@/lib/validation/databaseValidation';

export function showValidationErrors(result: ValidationResult) {
  return {
    errors: result.errors || [],
    warnings: result.warnings || [],
    isValid: result.isValid,
  };
} 