/**
 * Validation Utility Types
 * 
 * Core types for data validation, rules, and validation results.
 * Used across form validation, API validation, and data integrity checks.
 */

// Core validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  details?: ValidationDetail[];
}

export interface ValidationDetail {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  value?: unknown;
}

export interface ValidationOptions {
  stopOnFirstError?: boolean;
  includeWarnings?: boolean;
  context?: Record<string, unknown>;
  locale?: string;
  customMessages?: Record<string, string>;
}

// Validation rule types
export interface ValidationRule<T = unknown> {
  name: string;
  message?: string;
  severity?: 'error' | 'warning';
  validate: (value: T, context?: unknown) => boolean | string | Promise<boolean | string>;
  dependsOn?: string[];
  condition?: (context: unknown) => boolean;
}

export interface AsyncValidationRule<T = unknown> extends ValidationRule<T> {
  validate: (value: T, context?: unknown) => Promise<boolean | string>;
  timeout?: number;
  debounce?: number;
}

export interface ConditionalValidationRule<T = unknown> extends ValidationRule<T> {
  condition: (context: unknown) => boolean;
  rules: ValidationRule<T>[];
}

// Built-in validation rule types
export interface RequiredRule {
  type: 'required';
  message?: string;
}

export interface LengthRule {
  type: 'length';
  min?: number;
  max?: number;
  exact?: number;
  message?: string;
}

export interface PatternRule {
  type: 'pattern';
  pattern: RegExp | string;
  flags?: string;
  message?: string;
}

export interface RangeRule {
  type: 'range';
  min?: number;
  max?: number;
  inclusive?: boolean;
  message?: string;
}

export interface EmailRule {
  type: 'email';
  allowDisplayName?: boolean;
  requireTld?: boolean;
  message?: string;
}

export interface UrlRule {
  type: 'url';
  protocols?: string[];
  requireProtocol?: boolean;
  allowLocalhost?: boolean;
  message?: string;
}

export interface DateRule {
  type: 'date';
  format?: string;
  min?: Date | string;
  max?: Date | string;
  message?: string;
}

export interface CustomRule<T = unknown> {
  type: 'custom';
  validator: (value: T, context?: unknown) => boolean | string | Promise<boolean | string>;
  message?: string;
}

// Validation schema types
export type FieldValidationRule = 
  | RequiredRule
  | LengthRule
  | PatternRule
  | RangeRule
  | EmailRule
  | UrlRule
  | DateRule
  | CustomRule;

export type ValidationSchema<T = Record<string, unknown>> = {
  [K in keyof T]?: FieldValidationRule | FieldValidationRule[];
};

export interface SchemaValidationOptions extends ValidationOptions {
  allowUnknownFields?: boolean;
  stripUnknownFields?: boolean;
  abortEarly?: boolean;
}

// Validation context and state
export interface ValidationContext {
  values: Record<string, unknown>;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  isValidating: Record<string, boolean>;
  metadata?: Record<string, unknown>;
}

export interface FieldValidationState {
  isValidating: boolean;
  hasError: boolean;
  hasWarning: boolean;
  error?: string;
  warning?: string;
  lastValidated?: Date;
}

// Validation strategies
export type ValidationStrategy = 'onChange' | 'onBlur' | 'onSubmit' | 'manual';

export interface ValidationConfig {
  strategy: ValidationStrategy;
  debounceMs?: number;
  validateOnMount?: boolean;
  revalidateOnChange?: boolean;
  showWarnings?: boolean;
  locale?: string;
} 