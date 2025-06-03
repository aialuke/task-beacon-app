/**
 * Form Utility Types
 * 
 * Core types for form management, validation, and state handling.
 * Used across all form components and form-related hooks.
 */

// Form state management
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  initialValues: T;
}

export interface UseFormStateOptions<T = Record<string, unknown>> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => Promise<void> | void;
}

// Field types
export interface FieldState {
  value: unknown;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FieldProps<T = unknown> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  disabled?: boolean;
  required?: boolean;
}

// Validation types
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  custom?: (value: T) => string | null;
  asyncCustom?: (value: T) => Promise<string | null>;
}

export type ValidationSchema<T = Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]> | ValidationRule<T[K]>[];
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

// Form configuration
export interface FormConfig<T = Record<string, unknown>> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  enableReinitialize?: boolean;
  onSubmit: (values: T, helpers: FormHelpers<T>) => Promise<void> | void;
  onReset?: (values: T) => void;
  onValuesChange?: (values: T, prevValues: T) => void;
}

export interface FormHelpers<T = Record<string, unknown>> {
  setSubmitting: (isSubmitting: boolean) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setValues: (values: T) => void;
  resetForm: (nextInitialValues?: T) => void;
  validateForm: () => Promise<ValidationResult>;
  validateField: (field: keyof T) => Promise<string | null>;
}

// Form submission types
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  errors: Record<string, string>;
  success: boolean;
}

export interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

// Field array types
export interface FieldArrayHelpers<T = unknown> {
  push: (value: T) => void;
  pop: () => void;
  insert: (index: number, value: T) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  swap: (indexA: number, indexB: number) => void;
  replace: (index: number, value: T) => void;
}

export interface FieldArrayProps<T = unknown> {
  name: string;
  values: T[];
  helpers: FieldArrayHelpers<T>;
  error?: string;
} 