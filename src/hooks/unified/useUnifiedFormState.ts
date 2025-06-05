
/**
 * Unified Form State Management Hook
 * 
 * Consolidates multiple form state management approaches into a single,
 * consistent pattern. Replaces scattered form hooks with unified functionality.
 */

// === EXTERNAL LIBRARIES ===
import { useState, useCallback, useRef } from 'react';

// === INTERNAL UTILITIES ===
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';

// === TYPES ===
interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

interface FormOptions<T> {
  initialValues: T;
  validationSchema?: Partial<{ [K in keyof T]: (value: T[K]) => string | undefined }>;
  onSubmit?: (values: T) => Promise<void> | void;
  resetOnSubmit?: boolean;
}

interface FormActions<T> {
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string | undefined) => void;
  touchField: <K extends keyof T>(field: K) => void;
  resetField: <K extends keyof T>(field: K) => void;
  resetForm: () => void;
  validateField: <K extends keyof T>(field: K) => string | undefined;
  validateForm: () => boolean;
  submitForm: () => Promise<void>;
}

/**
 * Unified form state management hook
 * Consolidates various form patterns used throughout the application
 */
export function useUnifiedFormState<T extends Record<string, any>>(
  options: FormOptions<T>
): [FormState<T>, FormActions<T>] {
  const { initialValues, validationSchema, onSubmit, resetOnSubmit = false } = options;
  const initialStateRef = useRef(initialValues);

  // Create initial form state
  const createInitialState = useOptimizedCallback((): FormState<T> => {
    const fields = {} as { [K in keyof T]: FormField<T[K]> };
    
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
        dirty: false,
      };
    }

    return {
      fields,
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
    };
  }, [initialValues], { name: 'createInitialState' });

  const [formState, setFormState] = useState<FormState<T>>(createInitialState);

  // Field value setter
  const setFieldValue = useOptimizedCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormState(prev => {
        const newFields = { ...prev.fields };
        newFields[field] = {
          ...newFields[field],
          value,
          dirty: value !== initialStateRef.current[field],
        };

        // Validate field if schema exists
        let error: string | undefined;
        if (validationSchema?.[field]) {
          error = validationSchema[field]!(value);
        }
        newFields[field].error = error;

        const isDirty = Object.values(newFields).some(f => f.dirty);
        const isValid = Object.values(newFields).every(f => !f.error);

        return {
          ...prev,
          fields: newFields,
          isDirty,
          isValid,
        };
      });
    },
    [validationSchema],
    { name: 'setFieldValue' }
  );

  // Field error setter
  const setFieldError = useOptimizedCallback(
    <K extends keyof T>(field: K, error: string | undefined) => {
      setFormState(prev => {
        const newFields = { ...prev.fields };
        newFields[field] = { ...newFields[field], error };
        
        const isValid = Object.values(newFields).every(f => !f.error);
        
        return {
          ...prev,
          fields: newFields,
          isValid,
        };
      });
    },
    [],
    { name: 'setFieldError' }
  );

  // Touch field
  const touchField = useOptimizedCallback(
    <K extends keyof T>(field: K) => {
      setFormState(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [field]: { ...prev.fields[field], touched: true },
        },
      }));
    },
    [],
    { name: 'touchField' }
  );

  // Reset field
  const resetField = useOptimizedCallback(
    <K extends keyof T>(field: K) => {
      setFormState(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [field]: {
            value: initialStateRef.current[field],
            error: undefined,
            touched: false,
            dirty: false,
          },
        },
      }));
    },
    [],
    { name: 'resetField' }
  );

  // Reset entire form
  const resetForm = useOptimizedCallback(() => {
    setFormState(createInitialState());
  }, [createInitialState], { name: 'resetForm' });

  // Validate single field
  const validateField = useOptimizedCallback(
    <K extends keyof T>(field: K): string | undefined => {
      const value = formState.fields[field].value;
      if (validationSchema?.[field]) {
        return validationSchema[field]!(value);
      }
      return undefined;
    },
    [formState.fields, validationSchema],
    { name: 'validateField' }
  );

  // Validate entire form
  const validateForm = useOptimizedCallback((): boolean => {
    if (!validationSchema) return true;

    let isValid = true;
    const newFields = { ...formState.fields };

    for (const field in formState.fields) {
      if (validationSchema[field]) {
        const error = validationSchema[field]!(formState.fields[field].value);
        newFields[field] = { ...newFields[field], error, touched: true };
        if (error) isValid = false;
      }
    }

    setFormState(prev => ({
      ...prev,
      fields: newFields,
      isValid,
    }));

    return isValid;
  }, [formState.fields, validationSchema], { name: 'validateForm' });

  // Submit form
  const submitForm = useOptimizedCallback(async (): Promise<void> => {
    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const isValid = validateForm();
      if (!isValid) {
        throw new Error('Form validation failed');
      }

      if (onSubmit) {
        const values = {} as T;
        for (const key in formState.fields) {
          values[key] = formState.fields[key].value;
        }
        await onSubmit(values);
      }

      setFormState(prev => ({
        ...prev,
        submitCount: prev.submitCount + 1,
        isSubmitting: false,
      }));

      if (resetOnSubmit) {
        resetForm();
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitCount: prev.submitCount + 1,
      }));
      throw error;
    }
  }, [formState.fields, onSubmit, resetOnSubmit, validateForm, resetForm], { name: 'submitForm' });

  // Memoize form values for easy access
  const formValues = useOptimizedMemo(
    () => {
      const values = {} as T;
      for (const key in formState.fields) {
        values[key] = formState.fields[key].value;
      }
      return values;
    },
    [formState.fields],
    { name: 'formValues' }
  );

  // Create actions object
  const actions: FormActions<T> = useOptimizedMemo(
    () => ({
      setFieldValue,
      setFieldError,
      touchField,
      resetField,
      resetForm,
      validateField,
      validateForm,
      submitForm,
    }),
    [setFieldValue, setFieldError, touchField, resetField, resetForm, validateField, validateForm, submitForm],
    { name: 'formActions' }
  );

  // Add values to state for convenience
  const stateWithValues = useOptimizedMemo(
    () => ({
      ...formState,
      values: formValues,
    }),
    [formState, formValues],
    { name: 'stateWithValues' }
  );

  return [stateWithValues, actions];
}
