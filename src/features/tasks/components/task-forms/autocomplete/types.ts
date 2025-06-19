
/**
 * Autocomplete Types - Type definitions for user autocomplete components
 *
 * Centralized type definitions for validation states, component props,
 * and business logic interfaces used across autocomplete components.
 */

import type { RefObject } from 'react';

import type { User } from '@/types';

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
  onSubmit?: (() => void) | undefined;
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
  onSubmit?: (() => void) | undefined;
}

/**
 * Return type for useAutocompleteLogic hook
 */
export interface AutocompleteLogicReturn {
  // State
  inputValue: string;
  isFocused: boolean;
  selectedUser: User | undefined;
  exactMatch: User | undefined;
  ghostSuggestion: User | undefined;
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
 * Props for AutocompleteUserTag component - internal use only
 */
interface _AutocompleteUserTagProps {
  user: User;
  onClear: () => void;
  disabled?: boolean;
}

/**
 * Props for AutocompleteStatusIcon component - internal use only
 */
interface _AutocompleteStatusIconProps {
  selectedUser: User | undefined;
  validationState: ValidationState;
}
