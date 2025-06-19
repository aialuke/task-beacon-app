
/**
 * Autocomplete Utils - Helper Functions for Autocomplete Logic
 *
 * Utility functions for styling, validation, and user interaction logic.
 * Provides reusable functions for autocomplete components.
 */

import type { User } from '@/types';

import type { ValidationState } from './types';

/**
 * Get border color based on validation state and focus
 */
export function getBorderColor(
  disabled: boolean,
  selectedUser: User | undefined,
  isFocused: boolean,
  validationState: ValidationState
): string {
  if (disabled) return 'border-border/40';
  if (selectedUser) return 'border-green-500';
  if (!isFocused && validationState === 'empty') return 'border-border/40';

  switch (validationState) {
    case 'valid':
      return 'border-green-500';
    case 'invalid':
      return 'border-red-500';
    case 'partial':
      return 'border-yellow-500';
    default:
      return 'border-border/60';
  }
}

/**
 * Get display name for user
 */
export function getUserDisplayName(user: User): string {
  return user.name ?? user.email.split('@')[0] ?? 'Unknown User';
}

/**
 * Check if should show placeholder
 */
export function shouldShowPlaceholder(
  inputValue: string,
  isFocused: boolean,
  selectedUser: User | undefined
): boolean {
  return !inputValue && !isFocused && !selectedUser;
}
