/**
 * Form State Management Hook
 * 
 * Handles basic form state (values, errors, touched) without validation or submission logic.
 * Single responsibility: state management only.
 */

import { useState, useCallback, useMemo } from 'react';

import type { FormErrors, FormTouched } from '@/types/form.types';

export interface UseFormStateConfig<T extends Record<string, unknown>> {
  /** Initial form values */
  initialValues: T;
  /** Callback when form is reset */
  onReset?: () => void;
}

export interface UseFormStateReturn<T extends Record<string, unknown>> {
  // State
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isValid: boolean;
  isDirty: boolean;

  // Actions
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setErrors: (errors: FormErrors<T>) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  setTouched: (touched: FormTouched<T>) => void;
  reset: () => void;

  // Helpers
  getFieldError: (field: keyof T) => string | undefined;
  isFieldTouched: (field: keyof T) => boolean;
  isFieldDirty: (field: keyof T) => boolean;
}

/**
 * Hook for managing form state without validation or submission logic
 */
export function useFormState<T extends Record<string, unknown>>(
  config: UseFormStateConfig<T>
): UseFormStateReturn<T> {
  const { initialValues, onReset } = config;

  // Form field values
  const [values, setValuesState] = useState<T>(initialValues);
  
  // Form validation state
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});

  // === FIELD ACTIONS ===

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched({});
    if (onReset) onReset();
  }, [initialValues, onReset]);

  // === COMPUTED PROPERTIES ===

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => 
      values[key as keyof T] !== initialValues[key as keyof T]
    );
  }, [values, initialValues]);

  // === HELPER FUNCTIONS ===

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return errors[field];
  }, [errors]);

  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return !!touched[field];
  }, [touched]);

  const isFieldDirty = useCallback((field: keyof T): boolean => {
    return values[field as keyof T] !== initialValues[field as keyof T];
  }, [values, initialValues]);

  return {
    // State
    values,
    errors,
    touched,
    isValid,
    isDirty,
    
    // Actions
    setFieldValue,
    setValues,
    setFieldError,
    setErrors,
    setFieldTouched,
    setTouched,
    reset,
    
    // Helpers
    getFieldError,
    isFieldTouched,
    isFieldDirty,
  };
} 