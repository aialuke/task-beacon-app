
/**
 * Common Validation Schemas - Phase 1 Implementation
 * 
 * Shared validation schemas and utilities used across the application.
 */

import { z } from 'zod';
import { createTextSchema, VALIDATION_MESSAGES } from './validation';
import { DEFAULT_PAGINATION_CONFIG } from '@/types/pagination.types';

// === COMMON FIELD SCHEMAS ===

// === NOTE: Schemas kept for internal use but exports removed ===

const uuidSchema = z.string().uuid('Invalid ID format');
const nonEmptyStringSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);
const optionalStringSchema = z.string().optional().or(z.literal(''));
const timestampSchema = z.string().datetime('Invalid timestamp format');

const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  pageSize: z.number().int()
    .min(DEFAULT_PAGINATION_CONFIG.minPageSize, `Page size must be at least ${DEFAULT_PAGINATION_CONFIG.minPageSize}`)
    .max(DEFAULT_PAGINATION_CONFIG.maxPageSize, `Page size cannot exceed ${DEFAULT_PAGINATION_CONFIG.maxPageSize}`)
    .default(DEFAULT_PAGINATION_CONFIG.defaultPageSize),
  total: z.number().int().min(0).optional(),
});

const paginationMetaSchema = z.object({
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  totalCount: z.number().int().min(0),
  pageSize: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

const sortingSchema = z.object({
  field: z.string().min(1, 'Sort field is required'),
  order: sortOrderSchema,
});

// === API RESPONSE SCHEMAS ===

// === NOTE: API response schema exports removed as unused ===

// === FORM SCHEMAS ===

// === NOTE: Form and utility schema exports removed as unused ===

// === NOTE: Type exports and validation utilities removed as unused ===
