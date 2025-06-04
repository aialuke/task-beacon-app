
/**
 * Utility Types Barrel File - Updated
 * 
 * Now imports from the streamlined type system to eliminate duplication.
 */

// Import from streamlined system
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

// Re-export form utilities from the main form types
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

// Legacy validation types (kept for backward compatibility)
export type {
  ValidationResult as UtilityValidationResult,
  ValidationDetail,
  ValidationOptions,
  ValidationRule as UtilityValidationRule,
  AsyncValidationRule,
  ConditionalValidationRule,
} from './validation.types';
