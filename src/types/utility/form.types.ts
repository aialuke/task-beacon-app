/**
 * Form Utility Types
 * 
 * Comprehensive types for form management, validation, and state handling.
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

// Field-level types
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

// Multi-step form types
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<Record<string, unknown>>;
  validationSchema?: ValidationSchema;
  isOptional?: boolean;
  canSkip?: boolean;
}

export interface MultiStepFormState {
  currentStep: number;
  completedSteps: number[];
  formData: Record<string, unknown>;
  isValid: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export interface MultiStepFormHelpers {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setStepData: (step: number, data: Record<string, unknown>) => void;
  validateCurrentStep: () => Promise<boolean>;
  submitForm: () => Promise<void>;
}

// Conditional field types
export interface ConditionalField {
  condition: (values: Record<string, unknown>) => boolean;
  fields: string[];
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
}

export interface DynamicFormConfig {
  baseFields: string[];
  conditionalFields: ConditionalField[];
  dependencies: Record<string, string[]>;
}

// Form persistence types
export interface FormPersistenceConfig {
  key: string;
  storage: 'localStorage' | 'sessionStorage';
  include?: string[];
  exclude?: string[];
  debounceMs?: number;
  encrypt?: boolean;
}

// Auto-save types
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // milliseconds
  onSave: (values: Record<string, unknown>) => Promise<void>;
  onError?: (error: Error) => void;
  skipValidation?: boolean;
}

export interface AutoSaveState {
  isSaving: boolean;
  lastSaved?: Date;
  error?: string;
  saveCount: number;
}

// Form accessibility types
export interface FormAccessibilityConfig {
  announceErrors: boolean;
  announceSuccess: boolean;
  focusOnError: boolean;
  keyboardNavigation: boolean;
  ariaLabels: Record<string, string>;
}

// Form optimization types
export interface FormOptimizationConfig {
  debounceValidation: number;
  throttleSubmission: number;
  memoizeValidation: boolean;
  lazyValidation: boolean;
  asyncValidationTimeout: number;
}

// Form analytics types
export interface FormAnalytics {
  startTime: Date;
  endTime?: Date;
  fieldInteractions: Record<string, number>;
  validationErrors: Record<string, number>;
  abandonmentPoint?: string;
  completionTime?: number;
  submitAttempts: number;
}

// Error types specific to forms
export interface FormError {
  field?: string;
  message: string;
  type: 'validation' | 'submission' | 'network' | 'server';
  code?: string;
}

export interface FormErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Form context types
export interface FormContextValue<T = Record<string, unknown>> {
  formState: FormState<T>;
  formHelpers: FormHelpers<T>;
  formConfig: FormConfig<T>;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  validateForm: () => Promise<ValidationResult>;
} 