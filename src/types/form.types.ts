/**
 * Form Types
 *
 * All form-related type definitions including validation, state, and field types.
 */

// === FORM STATE TYPES ===
// Remove FormState and FormTouched type/interface definitions

// === VALIDATION TYPES ===
// Use canonical ValidationResult from validators;

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

interface FieldValidationState {
  isValid: boolean;
  error?: string;
  isTouched: boolean;
  isDirty: boolean;
}

// === FORM SUBMISSION TYPES ===
interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// === FORM FIELD TYPES ===
interface BaseFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
}

interface SelectFieldProps<T = string> extends BaseFieldProps {
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
interface FormConfig<
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
