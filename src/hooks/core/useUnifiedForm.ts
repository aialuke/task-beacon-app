/**
 * Unified Form Hook - Phase 2 Consolidation
 *
 * Generic form state management hook that eliminates duplicate form patterns.
 * Replaces scattered form state logic with standardized approach.
 */

import { useState, useCallback, useMemo } from 'react';

import type { FormState, FormErrors, FormTouched } from '@/types/form.types';

import { useSubmissionState } from './useLoadingState';

// === CORE INTERFACES ===

export interface UnifiedFormConfig<T extends Record<string, unknown>> {
  /** Initial form values */
  initialValues: T;
  /** Custom validation function */
  validate?: (values: T) => FormErrors<T>;
  /** Form submission handler */
  onSubmit?: (values: T) => Promise<void> | void;
  /** Callback when form is reset */
  onReset?: () => void;
  /** Whether to validate on field change */
  validateOnChange?: boolean;
  /** Whether to validate on field blur */
  validateOnBlur?: boolean;
}

export interface UnifiedFormActions<T extends Record<string, unknown>> {
  /** Set a specific field value */
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  /** Set multiple field values */
  setValues: (values: Partial<T>) => void;
  /** Set field error */
  setFieldError: (field: keyof T, error: string | null) => void;
  /** Set multiple field errors */
  setErrors: (errors: FormErrors<T>) => void;
  /** Mark field as touched */
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  /** Mark multiple fields as touched */
  setTouched: (touched: FormTouched<T>) => void;
  /** Submit the form */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  /** Reset form to initial state */
  reset: () => void;
  /** Validate entire form */
  validateForm: () => boolean;
  /** Validate specific field */
  validateField: (field: keyof T) => boolean;
}

export interface UnifiedFormReturn<T extends Record<string, unknown>>
  extends FormState<T>,
    UnifiedFormActions<T> {
  /** Helper to check if field has error */
  getFieldError: (field: keyof T) => string | undefined;
  /** Helper to check if field is touched */
  isFieldTouched: (field: keyof T) => boolean;
  /** Helper to check if field is dirty */
  isFieldDirty: (field: keyof T) => boolean;
  /** Submission state */
  isSubmitting: boolean;
  /** Helper to create field props */
  getFieldProps: (field: keyof T) => {
    value: T[keyof T];
    onChange: (value: T[keyof T]) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
}

// === UNIFIED FORM HOOK ===

/**
 * Generic form hook with comprehensive state management
 */
export function useUnifiedForm<T extends Record<string, unknown>>(
  config: UnifiedFormConfig<T>
): UnifiedFormReturn<T> {
  const {
    initialValues,
    validate,
    onSubmit,
    onReset,
    validateOnChange = false,
    validateOnBlur = true,
  } = config;

  // Form field values
  const [values, setValuesState] = useState<T>(initialValues);

  // Form validation state
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});

  // Submission state using unified loading hook
  const {
    isSubmitting,
    startSubmitting,
    stopSubmitting,
    setError: setSubmissionError,
  } = useSubmissionState();

  // === VALIDATION HELPERS ===

  const validateField = useCallback(
    (field: keyof T): boolean => {
      if (!validate) return true;

      const fieldErrors = validate(values);
      const fieldError = fieldErrors[field];

      setErrors(prev => ({
        ...prev,
        [field]: fieldError || undefined,
      }));

      return !fieldError;
    },
    [values, validate]
  );

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const formErrors = validate(values);
    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  // === FIELD ACTIONS ===

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setFieldValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValuesState(prev => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      // Validate on change if enabled
      if (validateOnChange && validate) {
        setTimeout(() => validateField(field), 0);
      }
    },
    [errors, validateOnChange, validate, validateField]
  );

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, []);

  const setFieldTouched = useCallback(
    (field: keyof T, isTouched: boolean) => {
      setTouched(prev => ({ ...prev, [field]: isTouched }));

      // Validate on blur if enabled
      if (isTouched && validateOnBlur && validate) {
        setTimeout(() => validateField(field), 0);
      }
    },
    [validateOnBlur, validate, validateField]
  );

  // === FORM ACTIONS ===

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as FormTouched<T>);
      setTouched(allTouched);

      // Validate form
      if (!validateForm()) {
        return;
      }

      if (!onSubmit) return;

      startSubmitting();
      try {
        await onSubmit(values);
      } catch (error) {
        setSubmissionError(
          error instanceof Error ? error.message : 'Form submission failed'
        );
      } finally {
        stopSubmitting();
      }
    },
    [
      values,
      validateForm,
      onSubmit,
      startSubmitting,
      stopSubmitting,
      setSubmissionError,
    ]
  );

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
    return Object.keys(values).some(
      key => values[key as keyof T] !== initialValues[key as keyof T]
    );
  }, [values, initialValues]);

  // === HELPER FUNCTIONS ===

  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return errors[field];
    },
    [errors]
  );

  const isFieldTouched = useCallback(
    (field: keyof T): boolean => {
      return !!touched[field];
    },
    [touched]
  );

  const isFieldDirty = useCallback(
    (field: keyof T): boolean => {
      return values[field as keyof T] !== initialValues[field as keyof T];
    },
    [values, initialValues]
  );

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: (value: T[keyof T]) => setFieldValue(field, value),
      onBlur: () => setFieldTouched(field, true),
      error: getFieldError(field),
      touched: isFieldTouched(field),
    }),
    [values, setFieldValue, setFieldTouched, getFieldError, isFieldTouched]
  );

  return {
    // Form state
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,

    // Actions
    setFieldValue,
    setValues,
    setFieldError,
    setErrors,
    setFieldTouched,
    setTouched,
    handleSubmit,
    reset,
    validateForm,
    validateField,

    // Helpers
    getFieldError,
    isFieldTouched,
    isFieldDirty,
    getFieldProps,
  };
}

// === SPECIALIZED FORM HOOKS ===

/**
 * Simple form hook for basic forms without complex validation
 */
export function useSimpleForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit?: (values: T) => Promise<void> | void
) {
  return useUnifiedForm({
    initialValues,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  });
}
