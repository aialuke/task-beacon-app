
/**
 * Form Types - Comprehensive Form System
 * 
 * Unified form types eliminating duplication across form components.
 */

// Core form state interface
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form validation interfaces
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
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

// Field component props
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

export interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
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
