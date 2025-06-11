/**
 * Form Types
 *
 * All form-related type definitions including validation, state, and field types.
 */

// === FORM STATE TYPES ===
export interface FormState<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export type FormErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string;
};

export type FormTouched<T extends Record<string, unknown>> = {
  [K in keyof T]?: boolean;
};

// === VALIDATION TYPES ===
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: unknown;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface FieldValidationState {
  isValid: boolean;
  error?: string;
  isTouched: boolean;
  isDirty: boolean;
}

// === FORM SUBMISSION TYPES ===
export interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// === FORM FIELD TYPES ===
export interface BaseFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
}

export interface SelectFieldProps<T = string> extends BaseFieldProps {
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  options: {
    value: T;
    label: string;
    disabled?: boolean;
  }[];
}

// === FORM CONFIGURATION ===
export interface FormConfig<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  initialValues: T;
  validationRules?: {
    [K in keyof T]?: ValidationRule;
  };
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}
