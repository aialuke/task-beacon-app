import { z } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface ValidationOptions {
  stopOnFirstError?: boolean;
}

export function validateObject<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const { stopOnFirstError = false } = options;
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
        if (stopOnFirstError) break;
      }
      const firstError = Object.values(errors)[0];
      return {
        isValid: false,
        errors,
        firstError,
      };
    }
    const errorMessage = 'Validation failed';
    return {
      isValid: false,
      errors: { general: errorMessage },
      firstError: errorMessage,
    };
  }
}

export function validateWithError<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  return validateObject(schema, data, { stopOnFirstError: true });
} 