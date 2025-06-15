import type { User } from '@/types';

export type ValidationState = 'empty' | 'valid' | 'invalid' | 'partial';

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

  // Refs - Fix the RefObject type to allow null
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export interface AutocompleteUserInputProps {
  value: string;
  onChange: (userId: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
