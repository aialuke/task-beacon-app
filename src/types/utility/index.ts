/**
 * Utility Types Barrel File
 * 
 * Centralized exports for all utility types including form, validation,
 * and TypeScript helper types.
 */

// Form utility types
export type {
  FormState,
  UseFormStateOptions,
  FieldState,
  FieldProps,
  ValidationRule,
  ValidationSchema,
  ValidationResult,
  FormConfig,
  FormHelpers,
  FormSubmissionState,
  FormSubmissionResult,
  FieldArrayHelpers,
  FieldArrayProps,
} from './form.types';

// Validation utility types
export type {
  ValidationResult as UtilityValidationResult,
  ValidationDetail,
  ValidationOptions,
  ValidationRule as UtilityValidationRule,
  AsyncValidationRule,
  ConditionalValidationRule,
  RequiredRule,
  LengthRule,
  PatternRule,
  RangeRule,
  EmailRule,
  UrlRule,
  DateRule,
  CustomRule,
  FieldValidationRule,
  ValidationSchema as UtilityValidationSchema,
  SchemaValidationOptions,
  ValidationContext,
  FieldValidationState,
  ValidationStrategy,
  ValidationConfig,
} from './validation.types';

// TypeScript helper types
export type {
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  Merge,
  Override,
  PropsWithClassName,
  PropsWithChildren,
} from './helpers.types'; 