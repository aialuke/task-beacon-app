
/**
 * Batch Image Validation Utilities
 * 
 * Functions for validating multiple images and aggregating results.
 */

import type { EnhancedImageValidationOptions, ValidationResult } from '../types';
import { validateImageEnhanced } from './core';

/**
 * Validate multiple files at once
 */
export async function validateImagesEnhanced(
  files: File[],
  options: EnhancedImageValidationOptions = {}
): Promise<ValidationResult[]> {
  return Promise.all(
    files.map(file => validateImageEnhanced(file, options))
  );
}

/**
 * Check if all validation results are valid
 */
export function areAllValidationResultsValid(results: ValidationResult[]): boolean {
  return results.every(result => result.valid);
}

/**
 * Get all validation errors from results
 */
export function getValidationErrors(results: ValidationResult[]): string[] {
  return results
    .filter(result => !result.valid && result.error)
    .map(result => result.error!);
}

/**
 * Get all validation warnings from results
 */
export function getValidationWarnings(results: ValidationResult[]): string[] {
  return results
    .filter(result => result.warnings && result.warnings.length > 0)
    .flatMap(result => result.warnings!);
}
