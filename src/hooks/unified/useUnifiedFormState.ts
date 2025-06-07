
/**
 * Unified Form State Hook
 * 
 * Centralized form state management that consolidates patterns from multiple form hooks.
 * Provides consistent form behavior across the application.
 */

import { useState, useCallback, useMemo } from 'react';
import { validateField, validateForm, type ValidationResult } from '@/lib/utils/shared';

export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends Record<string, string> = Record<string, string>> {
  fields: Record<keyof T, FormField<T[keyof T]>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  hasErrors: boolean;
  submitCount: number;
}

export interface FormActions<T extends Record<string, string> = Record<string, string>> {
  setFieldValue: (name: keyof T, value: T[keyof T]) => void;
  setFieldError: (name: keyof T, error: string | undefined) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  validateField: (name: keyof T) => ValidationResult;
  validateForm: () => { isValid: boolean; errors: Record<string, string> };
  resetForm: () => void;
  resetField: (name: keyof T) => void;
  submitForm: (e?: React.FormEvent) => Promise<void>;
  setSubmitting: (submitting: boolean) => void;
}

export interface UseUnifiedFormStateOptions<T extends Record<string, string> = Record<string, string>> {
  initialValues: T;
  validationSchema?: Record<keyof T, (value: T[keyof T]) => string | undefined>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Unified form state management hook
 */
export function useUnifiedFormState<T extends Record<string, string> = Record<string, string>>({
  initialValues,
  validationSchema = {} as Record<keyof T, (value: T[keyof T]) => string | undefined>,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseUnifiedFormStateOptions<T>): [FormState<T>, FormActions<T>] {
  // Initialize form fields
  const [fields, setFields] = useState<Record<keyof T, FormField<T[keyof T]>>>(() => {
    const initialFields: Record<keyof T, FormField<T[keyof T]>> = {} as Record<keyof T, FormField<T[keyof T]>>;
    Object.keys(initialValues).forEach(key => {
      const fieldKey = key as keyof T;
      initialFields[fieldKey] = {
        value: initialValues[fieldKey],
        touched: false,
        dirty: false,
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Computed form state
  const formState = useMemo((): FormState<T> => {
    const fieldValues = Object.values(fields);
    const hasErrors = fieldValues.some(field => !!field.error);
    const isDirty = fieldValues.some(field => field.dirty);
    const isValid = !hasErrors;

    return {
      fields,
      isValid,
      isSubmitting,
      isDirty,
      hasErrors,
      submitCount,
    };
  }, [fields, isSubmitting, submitCount]);

  // Field validation using consolidated validation
  const validateFieldInternal = useCallback((name: keyof T): ValidationResult => {
    const field = fields[name];
    const validator = validationSchema[name];
    
    if (!validator) {
      return { isValid: true, errors: [] };
    }

    const error = validator(field?.value);
    return {
      isValid: !error,
      errors: error ? [error] : [],
    };
  }, [fields, validationSchema]);

  // Form validation
  const validateFormInternal = useCallback(() => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(fields).forEach(key => {
      const fieldKey = key as keyof T;
      const result = validateFieldInternal(fieldKey);
      if (!result.isValid && result.errors.length > 0) {
        errors[key] = result.errors[0];
        isValid = false;
      }
    });

    return { isValid, errors };
  }, [fields, validateFieldInternal]);

  // Actions
  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        dirty: value !== initialValues[name],
        ...(validateOnChange && {
          error: validationSchema[name]?.(value),
        }),
      },
    }));
  }, [initialValues, validationSchema, validateOnChange]);

  const setFieldError = useCallback((name: keyof T, error: string | undefined) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, touched: boolean) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
        ...(validateOnBlur && touched && {
          error: validationSchema[name]?.(prev[name]?.value),
        }),
      },
    }));
  }, [validationSchema, validateOnBlur]);

  const resetForm = useCallback(() => {
    setFields(() => {
      const resetFields: Record<keyof T, FormField<T[keyof T]>> = {} as Record<keyof T, FormField<T[keyof T]>>;
      Object.keys(initialValues).forEach(key => {
        const fieldKey = key as keyof T;
        resetFields[fieldKey] = {
          value: initialValues[fieldKey],
          touched: false,
          dirty: false,
        };
      });
      return resetFields;
    });
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  const resetField = useCallback((name: keyof T) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        value: initialValues[name],
        touched: false,
        dirty: false,
      },
    }));
  }, [initialValues]);

  const submitForm = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitCount(prev => prev + 1);
    
    // Validate all fields
    const validation = validateFormInternal();
    
    // Update field errors
    Object.keys(validation.errors).forEach(key => {
      const fieldKey = key as keyof T;
      setFieldError(fieldKey, validation.errors[key]);
    });

    if (!validation.isValid) {
      return;
    }

    if (!onSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      const values = Object.keys(fields).reduce((acc, key) => {
        const fieldKey = key as keyof T;
        acc[fieldKey] = fields[fieldKey]?.value as T[keyof T];
        return acc;
      }, {} as T);

      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateFormInternal, setFieldError, onSubmit, fields]);

  const actions: FormActions<T> = {
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField: validateFieldInternal,
    validateForm: validateFormInternal,
    resetForm,
    resetField,
    submitForm,
    setSubmitting: setIsSubmitting,
  };

  return [formState, actions];
}
