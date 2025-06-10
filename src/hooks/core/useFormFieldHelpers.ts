/**
 * Form Field Helpers Hook
 * 
 * Provides utility functions for form field interactions and prop generation.
 * Single responsibility: field helpers and utilities.
 */

import { useCallback } from 'react';

import type { UseFormStateReturn } from './useFormState';
import type { UseFormValidationReturn } from './useFormValidation';

export interface UseFormFieldHelpersConfig<T extends Record<string, unknown>> {
  formState: UseFormStateReturn<T>;
  validation: UseFormValidationReturn<T>;
}

export interface UseFormFieldHelpersReturn<T extends Record<string, unknown>> {
  /** Helper to create field props */
  getFieldProps: (field: keyof T) => {
    value: T[keyof T];
    onChange: (value: T[keyof T]) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
  /** Enhanced field value setter with validation */
  setFieldValueWithValidation: (field: keyof T, value: T[keyof T]) => void;
  /** Enhanced field touched setter with validation */
  setFieldTouchedWithValidation: (field: keyof T, touched: boolean) => void;
  /** Validate specific field and update errors */
  validateFieldAndSetError: (field: keyof T) => boolean;
  /** Validate entire form and update errors */
  validateFormAndSetErrors: () => boolean;
}

/**
 * Hook for form field helper utilities
 */
export function useFormFieldHelpers<T extends Record<string, unknown>>(
  config: UseFormFieldHelpersConfig<T>
): UseFormFieldHelpersReturn<T> {
  const { formState, validation } = config;

  // === ENHANCED FIELD ACTIONS WITH VALIDATION ===

  const setFieldValueWithValidation = useCallback((field: keyof T, value: T[keyof T]) => {
    formState.setFieldValue(field, value);
    
    // Validate on change if enabled
    if (validation.shouldValidateOnChange) {
      setTimeout(() => {
        const error = validation.validateField(field, { ...formState.values, [field]: value });
        formState.setFieldError(field, error || null);
      }, 0);
    }
  }, [formState, validation]);

  const setFieldTouchedWithValidation = useCallback((field: keyof T, isTouched: boolean) => {
    formState.setFieldTouched(field, isTouched);
    
    // Validate on blur if enabled
    if (isTouched && validation.shouldValidateOnBlur) {
      setTimeout(() => {
        const error = validation.validateField(field, formState.values);
        formState.setFieldError(field, error || null);
      }, 0);
    }
  }, [formState, validation]);

  // === VALIDATION HELPERS ===

  const validateFieldAndSetError = useCallback((field: keyof T): boolean => {
    const error = validation.validateField(field, formState.values);
    formState.setFieldError(field, error || null);
    return !error;
  }, [formState, validation]);

  const validateFormAndSetErrors = useCallback((): boolean => {
    const errors = validation.validateForm(formState.values);
    formState.setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState, validation]);

  // === FIELD PROPS GENERATOR ===

  const getFieldProps = useCallback((field: keyof T) => ({
    value: formState.values[field],
    onChange: (value: T[keyof T]) => setFieldValueWithValidation(field, value),
    onBlur: () => setFieldTouchedWithValidation(field, true),
    error: formState.getFieldError(field),
    touched: formState.isFieldTouched(field),
  }), [formState, setFieldValueWithValidation, setFieldTouchedWithValidation]);

  return {
    getFieldProps,
    setFieldValueWithValidation,
    setFieldTouchedWithValidation,
    validateFieldAndSetError,
    validateFormAndSetErrors,
  };
} 