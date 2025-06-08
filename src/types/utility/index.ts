
/**
 * Utility Types - Streamlined Exports
 * 
 * Simplified to essential utility types without legacy compatibility layers.
 */

// Core utility types from streamlined system
export type {
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  Merge,
  Override,
  PropsWithClassName,
  PropsWithChildren,
  AsyncState,
  LoadingState,
  FormErrors,
  FormTouched,
  EventHandler,
  AsyncEventHandler,
} from '../utility.types';

// Form utilities from main form types
export type {
  FormState,
  ValidationRule,
  ValidationResult,
  FieldValidationState,
  FormSubmissionState,
  FormSubmissionResult,
  BaseFieldProps,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  FormConfig,
} from '../form.types';
