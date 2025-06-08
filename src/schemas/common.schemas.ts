
/**
 * Common Validation Schemas - Phase 1 Implementation
 * 
 * Shared validation schemas and utilities used across the application.
 */

import { z } from 'zod';
import { createTextSchema, VALIDATION_MESSAGES } from './validation';
import { DEFAULT_PAGINATION_CONFIG } from '@/types/pagination.types';

// === COMMON FIELD SCHEMAS ===

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid ID format');

/**
 * Non-empty string schema
 */
export const nonEmptyStringSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);

/**
 * Optional string schema (allows empty strings)
 */
export const optionalStringSchema = z.string().optional().or(z.literal(''));

/**
 * Timestamp schema for API responses
 */
export const timestampSchema = z.string().datetime('Invalid timestamp format');

/**
 * Pagination schema - aligned with centralized types
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  pageSize: z.number().int()
    .min(DEFAULT_PAGINATION_CONFIG.minPageSize, `Page size must be at least ${DEFAULT_PAGINATION_CONFIG.minPageSize}`)
    .max(DEFAULT_PAGINATION_CONFIG.maxPageSize, `Page size cannot exceed ${DEFAULT_PAGINATION_CONFIG.maxPageSize}`)
    .default(DEFAULT_PAGINATION_CONFIG.defaultPageSize),
  total: z.number().int().min(0).optional(),
});

/**
 * Pagination metadata schema - for API responses
 */
export const paginationMetaSchema = z.object({
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  totalCount: z.number().int().min(0),
  pageSize: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

/**
 * Sort order schema
 */
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

/**
 * Generic sorting schema
 */
export const sortingSchema = z.object({
  field: z.string().min(1, 'Sort field is required'),
  order: sortOrderSchema,
});

// === API RESPONSE SCHEMAS ===

/**
 * Standard API error schema
 */
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
});

/**
 * Standard API success response schema
 */
export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

/**
 * Standard API error response schema
 */
export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: apiErrorSchema,
});

/**
 * Combined API response schema
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([
    apiSuccessSchema(dataSchema),
    apiErrorResponseSchema,
  ]);

/**
 * Paginated API response schema
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: paginationMetaSchema,
    message: z.string().optional(),
  });

// === FORM SCHEMAS ===

/**
 * Search form schema
 */
export const searchFormSchema = z.object({
  query: createTextSchema(0, 200, false),
  filters: z.record(z.string()).optional(),
});

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Invalid file' }),
  maxSize: z.number().positive().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
}).refine(
  (data) => data.file.size <= data.maxSize,
  (data) => ({ message: `File size must not exceed ${data.maxSize / (1024 * 1024)}MB` })
).refine(
  (data) => data.allowedTypes.includes(data.file.type),
  (data) => ({ message: `File type must be one of: ${data.allowedTypes.join(', ')}` })
);

// === UTILITY SCHEMAS ===

/**
 * Environment configuration schema
 */
export const envConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anonymous key is required'),
});

/**
 * Feature flag schema
 */
export const featureFlagSchema = z.object({
  name: z.string().min(1, 'Feature flag name is required'),
  enabled: z.boolean(),
  description: z.string().optional(),
  conditions: z.record(z.any()).optional(),
});

// === TYPE EXPORTS ===

export type PaginationInput = z.infer<typeof paginationSchema>;
export type PaginationMetaInput = z.infer<typeof paginationMetaSchema>;
export type SortingInput = z.infer<typeof sortingSchema>;
export type SearchFormInput = z.infer<typeof searchFormSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type EnvConfig = z.infer<typeof envConfigSchema>;
export type FeatureFlag = z.infer<typeof featureFlagSchema>;

// === VALIDATION UTILITIES ===

/**
 * Validates pagination parameters
 */
export function validatePagination(data: unknown) {
  return paginationSchema.safeParse(data);
}

/**
 * Validates pagination metadata
 */
export function validatePaginationMeta(data: unknown) {
  return paginationMetaSchema.safeParse(data);
}

/**
 * Validates sorting parameters
 */
export function validateSorting(data: unknown) {
  return sortingSchema.safeParse(data);
}

/**
 * Validates file upload
 */
export function validateFileUpload(data: unknown) {
  return fileUploadSchema.safeParse(data);
}

/**
 * Validates environment configuration
 */
export function validateEnvConfig(data: unknown) {
  return envConfigSchema.safeParse(data);
}
