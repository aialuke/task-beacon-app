/**
 * Autocomplete Types - Type Definitions for User Autocomplete Components
 *
 * Centralized type definitions for user autocomplete functionality.
 * Provides consistent typing across all autocomplete-related components.
 */

import type { User } from '@/types';

export interface AutocompleteUserInputProps {
  value: string; // user ID when selected, empty when not
  onChange: (userId: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export type ValidationState = 'valid' | 'invalid' | 'partial' | 'empty';

export interface AutocompleteLogicReturn {
  // State
  inputValue: string;
  isFocused: boolean;
  selectedUser: User | undefined;
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
  inputRef: React.RefObject<HTMLInputElement>;
}
