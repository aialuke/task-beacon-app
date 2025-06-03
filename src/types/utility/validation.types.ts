/**
 * Validation Utility Types
 * 
 * Comprehensive types for data validation, rules, and validation results.
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

// Advanced validation features
export interface CrossFieldValidation {
  fields: string[];
  validator: (values: Record<string, unknown>) => boolean | string;
  message?: string;
  trigger?: 'any' | 'all';
}

export interface DependentValidation {
  dependsOn: string | string[];
  condition: (dependentValues: unknown) => boolean;
  rules: FieldValidationRule[];
}

export interface ConditionalValidation {
  when: (values: Record<string, unknown>) => boolean;
  then: ValidationSchema;
  otherwise?: ValidationSchema;
}

// Validation result aggregation
export interface AggregatedValidationResult {
  isValid: boolean;
  hasWarnings: boolean;
  fieldResults: Record<string, ValidationResult>;
  crossFieldResults: ValidationResult[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    fieldsWithErrors: string[];
    fieldsWithWarnings: string[];
  };
}

// Validation performance metrics
export interface ValidationMetrics {
  totalTime: number;
  fieldValidationTimes: Record<string, number>;
  cacheHitRate: number;
  validationCount: number;
}

// Validation caching
export interface ValidationCache {
  get: (key: string) => ValidationResult | undefined;
  set: (key: string, result: ValidationResult, ttl?: number) => void;
  clear: (pattern?: string) => void;
  size: number;
}

// Validation messages and localization
export interface ValidationMessages {
  required: string;
  email: string;
  url: string;
  minLength: string;
  maxLength: string;
  min: string;
  max: string;
  pattern: string;
  custom: string;
  [key: string]: string;
}

export interface ValidationLocale {
  code: string;
  messages: ValidationMessages;
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

// Validation transformers and pipelines
export interface ValidationTransformer<T = unknown, U = unknown> {
  transform: (value: T) => U;
  validate?: (transformed: U) => boolean | string;
}

export interface ValidationPipeline<T = unknown> {
  transformers: ValidationTransformer[];
  validators: ValidationRule<T>[];
  finalTransform?: (value: unknown) => T;
}

// Validation error handling
export interface ValidationError extends Error {
  field?: string;
  value?: unknown;
  rule?: string;
  code?: string;
  details?: ValidationDetail[];
}

export interface ValidationErrorHandler {
  onError: (error: ValidationError) => void;
  onWarning?: (warning: ValidationDetail) => void;
  onSuccess?: (result: ValidationResult) => void;
}

// Validation utilities
export interface ValidationUtilities {
  email: (value: string) => boolean;
  url: (value: string) => boolean;
  phone: (value: string, country?: string) => boolean;
  creditCard: (value: string) => boolean;
  ssn: (value: string) => boolean;
  zipCode: (value: string, country?: string) => boolean;
  ipAddress: (value: string, version?: 4 | 6) => boolean;
  strongPassword: (value: string) => boolean;
}

// Validation middleware
export interface ValidationMiddleware {
  before?: (context: ValidationContext) => ValidationContext | Promise<ValidationContext>;
  after?: (result: ValidationResult, context: ValidationContext) => ValidationResult | Promise<ValidationResult>;
  onError?: (error: ValidationError, context: ValidationContext) => void;
} 