/**
 * Unified Validation Hooks - React Integration
 *
 * React hooks for validation integration with UI components.
 * Provides optimized validation functions with proper memoization.
 */

import { useCallback } from 'react';
import { z } from 'zod';

import {
  UnifiedValidationResult,
  validateWithUnifiedSchema,
  validateUnifiedField,
  validateUnifiedForm,
} from './unified-core';
import {
  unifiedEmailSchema,
  unifiedPasswordSchema,
  unifiedUserNameSchema,
  unifiedTaskTitleSchema,
  unifiedTaskDescriptionSchema,
  unifiedUrlSchema,
} from './unified-schemas';

/**
 * Unified validation hook that replaces all scattered validation patterns
 */
export function useUnifiedValidation(): {
  validateField: (
    fieldName: string,
    value: unknown
  ) => Promise<UnifiedValidationResult<unknown>>;
  validateForm: <T extends Record<string, unknown>>(
    data: T,
    schemas: Partial<Record<keyof T, z.ZodSchema<unknown>>>
  ) => UnifiedValidationResult<Partial<T>>;
  validateWithSchema: typeof validateWithUnifiedSchema;
  validateEmail: (email: string) => UnifiedValidationResult<string>;
  validatePassword: (password: string) => UnifiedValidationResult<string>;
  validateUserName: (name: string) => UnifiedValidationResult<string>;
  validateTaskTitle: (title: string) => UnifiedValidationResult<string>;
  validateTaskDescription: (
    description: string
  ) => UnifiedValidationResult<string>;
  validateUrl: (url: string) => UnifiedValidationResult<string>;
  schemas: {
    email: typeof unifiedEmailSchema;
    password: typeof unifiedPasswordSchema;
    userName: typeof unifiedUserNameSchema;
    taskTitle: typeof unifiedTaskTitleSchema;
    taskDescription: typeof unifiedTaskDescriptionSchema;
    url: typeof unifiedUrlSchema;
  };
} {
  const validateField = useCallback(
    async (fieldName: string, value: unknown) => {
      return await validateUnifiedField(fieldName, value);
    },
    []
  );

  const validateForm = useCallback(
    <T extends Record<string, unknown>>(
      data: T,
      schemas: Partial<Record<keyof T, z.ZodSchema<unknown>>>
    ) => {
      return validateUnifiedForm(data, schemas);
    },
    []
  );

  const validateEmail = useCallback((email: string) => {
    return validateWithUnifiedSchema(unifiedEmailSchema, email);
  }, []);

  const validatePassword = useCallback((password: string) => {
    return validateWithUnifiedSchema(unifiedPasswordSchema, password);
  }, []);

  const validateUserName = useCallback((name: string) => {
    return validateWithUnifiedSchema(unifiedUserNameSchema, name);
  }, []);

  const validateTaskTitle = useCallback((title: string) => {
    return validateWithUnifiedSchema(unifiedTaskTitleSchema, title);
  }, []);

  const validateTaskDescription = useCallback((description: string) => {
    return validateWithUnifiedSchema(unifiedTaskDescriptionSchema, description);
  }, []);

  const validateUrl = useCallback((url: string) => {
    return validateWithUnifiedSchema(unifiedUrlSchema, url);
  }, []);

  return {
    // Core validation functions
    validateField,
    validateForm,
    validateWithSchema: validateWithUnifiedSchema,

    // Field-specific validators
    validateEmail,
    validatePassword,
    validateUserName,
    validateTaskTitle,
    validateTaskDescription,
    validateUrl,

    // Schemas for direct use
    schemas: {
      email: unifiedEmailSchema,
      password: unifiedPasswordSchema,
      userName: unifiedUserNameSchema,
      taskTitle: unifiedTaskTitleSchema,
      taskDescription: unifiedTaskDescriptionSchema,
      url: unifiedUrlSchema,
    },
  };
}
