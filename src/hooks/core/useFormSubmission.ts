/**
 * Form Submission Hook
 * 
 * Handles form submission with validation and loading states.
 * Single responsibility: submission logic only.
 */

import { useCallback } from 'react';

import type { FormErrors, FormTouched } from '@/types/form.types';

import { useSubmissionState } from './useLoadingState';

export interface UseFormSubmissionConfig<T extends Record<string, unknown>> {
  /** Form submission handler */
  onSubmit?: (values: T) => Promise<void> | void;
}

export interface UseFormSubmissionReturn<T extends Record<string, unknown>> {
  /** Submission state */
  isSubmitting: boolean;
  /** Submit the form */
  handleSubmit: (
    values: T,
    validateForm: (values: T) => FormErrors<T>,
    setTouched: (touched: FormTouched<T>) => void,
    e?: React.FormEvent
  ) => Promise<void>;
}

/**
 * Hook for managing form submission logic
 */
export function useFormSubmission<T extends Record<string, unknown>>(
  config: UseFormSubmissionConfig<T>
): UseFormSubmissionReturn<T> {
  const { onSubmit } = config;

  // Submission state using unified loading hook
  const {
    isSubmitting,
    startSubmitting,
    stopSubmitting,
    setError: setSubmissionError,
  } = useSubmissionState();

  // === SUBMISSION LOGIC ===

  const handleSubmit = useCallback(async (
    values: T,
    validateForm: (values: T) => FormErrors<T>,
    setTouched: (touched: FormTouched<T>) => void,
    e?: React.FormEvent
  ) => {
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
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
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
  }, [onSubmit, startSubmitting, stopSubmitting, setSubmissionError]);

  return {
    isSubmitting,
    handleSubmit,
  };
} 