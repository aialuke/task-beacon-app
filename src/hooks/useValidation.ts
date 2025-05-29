import { useCallback } from 'react';
import { z } from 'zod';
import { toast } from '@/lib/toast';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface ValidationOptions {
  showToast?: boolean;
  stopOnFirstError?: boolean;
}

/**
 * Custom hook for form validation using Zod schemas
 */
export function useValidation() {
  /**
   * Validate data against a schema
   */
  const validate = useCallback(
    <T>(
      schema: z.ZodSchema<T>,
      data: unknown,
      options: ValidationOptions = {}
    ): ValidationResult => {
      const { showToast = false, stopOnFirstError = false } = options;

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

          if (showToast && firstError) {
            toast.error(firstError);
          }

          return {
            isValid: false,
            errors,
            firstError,
          };
        }

        // Handle non-Zod errors
        const errorMessage = 'Validation failed';
        if (showToast) {
          toast.error(errorMessage);
        }

        return {
          isValid: false,
          errors: { general: errorMessage },
          firstError: errorMessage,
        };
      }
    },
    []
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    <T>(
      schema: z.ZodSchema<T>,
      value: unknown,
      fieldName: string,
      options: ValidationOptions = {}
    ): { isValid: boolean; error?: string } => {
      const result = validate(schema, { [fieldName]: value }, options);

      return {
        isValid: result.isValid,
        error: result.errors[fieldName],
      };
    },
    [validate]
  );

  /**
   * Create a field validator function for a specific schema
   */
  const createFieldValidator = useCallback(
    <T>(schema: z.ZodSchema<T>, options: ValidationOptions = {}) => {
      return (value: unknown, fieldName: string) => {
        return validateField(schema, value, fieldName, options);
      };
    },
    [validateField]
  );

  /**
   * Validate with toast notification on error
   */
  const validateWithToast = useCallback(
    <T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult => {
      return validate(schema, data, {
        showToast: true,
        stopOnFirstError: true,
      });
    },
    [validate]
  );

  return {
    validate,
    validateField,
    validateWithToast,
    createFieldValidator,
  };
}
