/**
 * Form Types - Comprehensive Form System
 * 
 * Unified form types eliminating duplication across form components.
 */

// Form utility types
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

// Core form state interface
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Validation types
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  custom?: (value: T) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

export interface FieldValidationState {
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

// Form submission interfaces
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submittedAt: Date | null;
}

export interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string>;
}

// Form field component props - Using standardized definitions from component.types.ts
export type { 
  InputFieldProps, 
  TextareaFieldProps, 
  SelectFieldProps 
} from './component.types';

// Basic field props base (for custom field components)
export interface BaseFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  className?: string;
}

// Form configuration
export interface FormConfig<T = Record<string, unknown>> {
  initialValues: T;
  validationSchema?: Record<keyof T, ValidationRule>;
  onSubmit: (values: T) => Promise<FormSubmissionResult> | FormSubmissionResult;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSuccess?: boolean;
}
