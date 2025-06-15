/**
 * Autocomplete Logic Hook - Business Logic for User Autocomplete
 *
 * Custom hook that handles all autocomplete logic including:
 * - User search and matching
 * - Ghost text suggestions
 * - Keyboard interactions
 * - State management
 */

import { useState, useRef, useMemo, useEffect } from 'react';

import { useUsersQuery } from '@/features/users/hooks/useUsersQuery';

import type { AutocompleteLogicReturn, ValidationState } from './types';
import { getUserDisplayName } from './utils';

interface UseAutocompleteLogicProps {
  value: string;
  onChange: (userId: string) => void;
  onSubmit?: () => void;
}

export function useAutocompleteLogic({
  value,
  onChange,
  onSubmit,
}: UseAutocompleteLogicProps): AutocompleteLogicReturn {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { users } = useUsersQuery();

  // Find selected user
  const selectedUser = useMemo(
    () => users.find(user => user.id === value),
    [users, value]
  );

  // Find exact match for typed input
  const exactMatch = useMemo(() => {
    if (!inputValue.trim() || selectedUser) return null;

    const searchTerm = inputValue.toLowerCase().trim();
    return users.find(user => {
      const displayName = getUserDisplayName(user);
      return (
        displayName.toLowerCase() === searchTerm ||
        user.email.toLowerCase() === searchTerm
      );
    });
  }, [users, inputValue, selectedUser]);

  // Auto-select exact matches
  useEffect(() => {
    if (exactMatch && !selectedUser) {
      onChange(exactMatch.id);
      setInputValue('');
      // Keep focus on input after selection
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [exactMatch, selectedUser, onChange]);

  // Find the best matching suggestion for ghost text
  const ghostSuggestion = useMemo(() => {
    if (!inputValue.trim() || selectedUser || exactMatch) return null;

    const searchTerm = inputValue.toLowerCase();
    const match = users.find(user => {
      const displayName = getUserDisplayName(user);
      return (
        displayName.toLowerCase().startsWith(searchTerm) ||
        user.email.toLowerCase().startsWith(searchTerm)
      );
    });

    return match;
  }, [users, inputValue, selectedUser, exactMatch]);

  // Generate ghost text completion
  const ghostText = useMemo(() => {
    if (!ghostSuggestion || !inputValue) return '';

    const displayName = getUserDisplayName(ghostSuggestion);
    const email = ghostSuggestion.email;

    // Check if input matches start of name or email
    if (displayName.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return displayName.slice(inputValue.length);
    } else if (email.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return email.slice(inputValue.length);
    }

    return '';
  }, [ghostSuggestion, inputValue]);

  // Determine validation state
  const validationState: ValidationState = useMemo(() => {
    if (selectedUser) return 'valid';
    if (!inputValue.trim()) return 'empty';
    if (ghostSuggestion) return 'partial';
    return 'invalid';
  }, [selectedUser, inputValue, ghostSuggestion]);

  // Auto-focus input after user selection
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Don't clear selection when typing - let the user keep typing to search
    // Selection will only be cleared via backspace when input is empty
  };

  const handleAcceptSuggestion = () => {
    if (ghostSuggestion) {
      onChange(ghostSuggestion.id);
      setInputValue('');
      // Keep focus on input after selection
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleClearUser = () => {
    onChange('');
    setInputValue('');
    // Ensure input stays focused
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        // First check: if there's a ghost suggestion and no user selected, select the user
        if (ghostSuggestion && ghostText && !selectedUser) {
          e.preventDefault();
          e.stopPropagation();
          handleAcceptSuggestion();
        }
        // Second case: if user is already selected and onSubmit is provided, call onSubmit
        else if (selectedUser && onSubmit) {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }
        break;
      case 'Escape':
        setInputValue('');
        inputRef.current?.blur();
        break;
      case 'Backspace':
        // If input is empty and user is selected, clear the user
        if (selectedUser && !inputValue) {
          e.preventDefault();
          handleClearUser();
        }
        break;
    }
  };

  return {
    // State
    inputValue,
    isFocused,
    selectedUser,
    exactMatch,
    ghostSuggestion,
    ghostText,
    validationState,

    // Handlers
    handleInputChange,
    handleAcceptSuggestion,
    handleClearUser,
    handleKeyDown,
    setInputValue,
    setIsFocused,

    // Refs
    inputRef,
  };
}
