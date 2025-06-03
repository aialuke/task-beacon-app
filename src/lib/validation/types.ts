/**
 * Shared validation types and utilities
 * 
 * This file provides the standardized interfaces and utilities used across
 * all validation modules to ensure consistency and type safety.
 */

// Import the comprehensive ValidationResult from utility types
export type { 
  ValidationResult, 
  ValidationDetail,
  ValidationOptions 
} from '@/types/utility/validation.types';

/**
 * Simplified ValidationResult for basic validation cases
 * Maintains backward compatibility while allowing for enhanced details
 */
export interface BasicValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Standard error codes for validation failures
 */
export enum ValidationErrorCode {
  // Format validation errors
  REQUIRED = 'REQUIRED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_URL = 'INVALID_URL',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  INVALID_DATE = 'INVALID_DATE',
  DATE_IN_PAST = 'DATE_IN_PAST',

  // Database validation errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',

  // Business validation errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  FORBIDDEN_OPERATION = 'FORBIDDEN_OPERATION',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

/**
 * Standard warning codes for validation warnings
 */
export enum ValidationWarningCode {
  APPROACHING_LIMIT = 'APPROACHING_LIMIT',
  UNUSUAL_VALUE = 'UNUSUAL_VALUE',
  DEPRECATED_FORMAT = 'DEPRECATED_FORMAT',
  PERFORMANCE_WARNING = 'PERFORMANCE_WARNING',
  TEMPORARY_ISSUE = 'TEMPORARY_ISSUE',
}

/**
 * Enhanced validation detail with error codes
 */
export interface StandardValidationDetail {
  field?: string;
  code: ValidationErrorCode | ValidationWarningCode;
  message: string;
  severity: 'error' | 'warning' | 'info';
  value?: any;
  context?: Record<string, any>;
}

/**
 * Enhanced validation result with error codes and details
 */
export interface StandardValidationResult extends BasicValidationResult {
  details?: StandardValidationDetail[];
  errorCode?: ValidationErrorCode;
  metadata?: {
    validatedAt: Date;
    validator: string;
    processingTime?: number;
  };
}

/**
 * Validation context for consistent error handling
 */
export interface ValidationContext {
  validator: string;
  field?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

/**
 * Standard validation error class
 */
export class ValidationError extends Error {
  public readonly code: ValidationErrorCode;
  public readonly details: StandardValidationDetail[];
  public readonly context?: ValidationContext;

  constructor(
    code: ValidationErrorCode,
    message: string,
    details: StandardValidationDetail[] = [],
    context?: ValidationContext
  ) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
    this.context = context;
  }
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Configuration for async validation operations
 */
export interface AsyncValidationConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  abortController?: AbortController;
}

/**
 * Result type for async validation operations
 */
export type AsyncValidationResult = Promise<StandardValidationResult>;

/**
 * Validator function signatures
 */
export type SyncValidator<T = any> = (value: T, context?: ValidationContext) => BasicValidationResult;
export type AsyncValidator<T = any> = (value: T, context?: ValidationContext, config?: AsyncValidationConfig) => AsyncValidationResult; 