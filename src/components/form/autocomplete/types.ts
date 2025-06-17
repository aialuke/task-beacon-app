
/**
 * Autocomplete Types - Type definitions for user autocomplete components
 *
 * Centralized type definitions for validation states, component props,
 * and business logic interfaces used across autocomplete components.
 */

import type { User } from '@/types';
import type { RefObject } from 'react';

/**
 * Validation state for autocomplete input
 */
export type ValidationState = 'empty' | 'valid' | 'invalid' | 'partial';

/**
 * Props for AutocompleteUserInput component
 */
export interface AutocompleteUserInputProps {
  value: string;
  onChange: (userId: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for useAutocompleteLogic hook
 */
export interface UseAutocompleteLogicProps {
  value: string;
  onChange: (userId: string) => void;
  onSubmit?: () => void;
}

/**
 * Return type for useAutocompleteLogic hook
 */
export interface AutocompleteLogicReturn {
  // State
  inputValue: string;
  isFocused: boolean;
  selectedUser: User | null;
  exactMatch: User | null;
  ghostSuggestion: User | null;
  ghostText: string;
  validationState: ValidationState;

  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAcceptSuggestion: () => void;
  handleClearUser: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setInputValue: (value: string) => void;
  setIsFocused: (focused: boolean) => void;

  // Refs
  inputRef: RefObject<HTMLInputElement>;
}

/**
 * Props for AutocompleteUserTag component
 */
export interface AutocompleteUserTagProps {
  user: User;
  onClear: () => void;
  disabled?: boolean;
}

/**
 * Props for AutocompleteStatusIcon component
 */
export interface AutocompleteStatusIconProps {
  selectedUser: User | null;
  validationState: ValidationState;
}
