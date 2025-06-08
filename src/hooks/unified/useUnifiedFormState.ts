
import { useState, useCallback } from 'react';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/performance';
import type { FormState, ValidationResult } from '@/types/utility.types';

interface UseUnifiedFormStateOptions<T extends Record<string, string>> {
  initialValues?: Partial<T>;
  validationRules?: Partial<Record<keyof T, (value: string) => string | null>>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormFieldState {
  value: string;
  error: string | null;
  touched: boolean;
  isDirty: boolean;
}

/**
 * Unified form state management hook with optimized performance - Phase 2 Update
 * Enhanced integration with Zod validation system
 */
export function useUnifiedFormState<T extends Record<string, string>>(
  options: UseUnifiedFormStateOptions<T> = {}
) {
  const {
    initialValues = {} as Partial<T>,
    validationRules = {} as Partial<Record<keyof T, (value: string) => string | null>>,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  // Initialize field states with proper typing
  const initializeFields = useCallback(() => {
    const fields: Record<string, FormFieldState> = {};
    
    // If we have initial values, use them to set up fields
    if (initialValues && typeof initialValues === 'object') {
      const initialKeys = Object.keys(initialValues) as Array<keyof T>;
      initialKeys.forEach((key) => {
        const stringKey = String(key);
        const value = initialValues[key];
        fields[stringKey] = {
          value: typeof value === 'string' ? value : '',
          error: null,
          touched: false,
          isDirty: false,
        };
      });
    }
    
    return fields;
  }, [initialValues]);

  const [fields, setFields] = useState<Record<string, FormFieldState>>(initializeFields);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validate a single field - enhanced for Zod integration
  const validateField = useOptimizedCallback(
    (fieldName: string, value: string): string | null => {
      // Type-safe access to validation rules
      const fieldKey = fieldName as keyof T;
      const typedValidationRules = validationRules as Partial<Record<keyof T, (value: string) => string | null>>;
      const validator = typedValidationRules[fieldKey];
      return validator ? validator(value) : null;
    },
    [validationRules],
    { name: 'validateField' }
  );

  // Update field value with validation
  const setFieldValue = useOptimizedCallback(
    (fieldName: string, value: string) => {
      setFields(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          error: validateOnChange ? validateField(fieldName, value) : null,
          isDirty: true,
        },
      }));
    },
    [validateField, validateOnChange],
    { name: 'setFieldValue' }
  );

  // Mark field as touched
  const setFieldTouched = useOptimizedCallback(
    (fieldName: string) => {
      setFields(prev => {
        const field = prev[fieldName] || { value: '', error: null, touched: false, isDirty: false };
        return {
          ...prev,
          [fieldName]: {
            ...field,
            touched: true,
            error: validateOnBlur ? validateField(fieldName, field.value) : field.error,
          },
        };
      });
    },
    [validateField, validateOnBlur],
    { name: 'setFieldTouched' }
  );

  // Get field props for easy integration with form components
  const getFieldProps = useOptimizedCallback(
    (fieldName: string) => {
      const field = fields[fieldName] || { value: '', error: null, touched: false, isDirty: false };
      
      return {
        value: field.value,
        error: field.touched ? field.error : null,
        onChange: (value: string) => setFieldValue(fieldName, value),
        onBlur: () => setFieldTouched(fieldName),
      };
    },
    [fields, setFieldValue, setFieldTouched],
    { name: 'getFieldProps' }
  );

  // Get current form values - enhanced type safety
  const values = useOptimizedMemo(
    () => {
      const formValues = {} as Record<string, string>;
      Object.keys(fields).forEach(key => {
        formValues[key] = fields[key]?.value || '';
      });
      return formValues as T;
    },
    [fields],
    { name: 'formValues' }
  );

  // Validate all fields - enhanced for Zod compatibility
  const validateForm = useOptimizedCallback(
    (): ValidationResult => {
      const errors: Record<string, string> = {};
      let isValid = true;

      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
          const error = validateField(fieldName, field.value);
          if (error) {
            errors[fieldName] = error;
            isValid = false;
          }
        }
      });

      return { isValid, errors };
    },
    [fields, validateField],
    { name: 'validateForm' }
  );

  // Form state computed values
  const formState = useOptimizedMemo(
    () => {
      const validation = validateForm();
      const isDirty = Object.values(fields).some(field => field?.isDirty);
      const isTouched = Object.values(fields).some(field => field?.touched);
      
      return {
        values,
        errors: validation.errors,
        touched: Object.keys(fields).reduce((acc, key) => {
          acc[key] = fields[key]?.touched || false;
          return acc;
        }, {} as Record<string, boolean>),
        isSubmitting,
        isValid: validation.isValid,
        isDirty,
        isTouched,
        submitCount,
      } as FormState<T>;
    },
    [values, fields, isSubmitting, submitCount, validateForm],
    { name: 'formState' }
  );

  // Handle form submission - enhanced error handling
  const handleSubmit = useOptimizedCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      setSubmitCount(prev => prev + 1);
      
      // Mark all fields as touched for validation display
      setFields(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key]) {
            updated[key] = {
              ...updated[key],
              touched: true,
              error: validateField(key, updated[key].value),
            };
          }
        });
        return updated;
      });

      const validation = validateForm();
      if (!validation.isValid) {
        console.log('Form validation failed:', validation.errors);
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validateForm, onSubmit, values, validateField],
    { name: 'handleSubmit' }
  );

  // Reset form to initial state
  const resetForm = useOptimizedCallback(
    () => {
      setFields(initializeFields());
      setIsSubmitting(false);
      setSubmitCount(0);
    },
    [initializeFields],
    { name: 'resetForm' }
  );

  return {
    // Form state
    ...formState,
    
    // Field management
    setFieldValue,
    setFieldTouched,
    getFieldProps,
    
    // Form actions
    handleSubmit,
    resetForm,
    validateForm,
  };
}
