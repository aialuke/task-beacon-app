/**
 * Form Validation Hook
 * 
 * Handles form and field validation logic with configurable validation timing.
 * Single responsibility: validation only.
 */

import { useCallback } from 'react';

import type { FormErrors } from '@/types/form.types';

export interface UseFormValidationConfig<T extends Record<string, unknown>> {
  /** Custom validation function */
  validate?: (values: T) => FormErrors<T>;
  /** Whether to validate on field change */
  validateOnChange?: boolean;
  /** Whether to validate on field blur */
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T extends Record<string, unknown>> {
  /** Validate entire form */
  validateForm: (values: T) => FormErrors<T>;
  /** Validate specific field */
  validateField: (field: keyof T, values: T) => string | undefined;
  /** Check if validation should run on change */
  shouldValidateOnChange: boolean;
  /** Check if validation should run on blur */
  shouldValidateOnBlur: boolean;
}

/**
 * Hook for managing form validation logic
 */
export function useFormValidation<T extends Record<string, unknown>>(
  config: UseFormValidationConfig<T>
): UseFormValidationReturn<T> {
  const {
    validate,
    validateOnChange = false,
    validateOnBlur = true,
  } = config;

  // === VALIDATION FUNCTIONS ===

  const validateField = useCallback((field: keyof T, values: T): string | undefined => {
    if (!validate) return undefined;
    
    const fieldErrors = validate(values);
    return fieldErrors[field];
  }, [validate]);

  const validateForm = useCallback((values: T): FormErrors<T> => {
    if (!validate) return {};
    
    return validate(values);
  }, [validate]);

  return {
    validateForm,
    validateField,
    shouldValidateOnChange: validateOnChange,
    shouldValidateOnBlur: validateOnBlur,
  };
} 