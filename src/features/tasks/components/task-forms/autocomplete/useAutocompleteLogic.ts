
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

import type { AutocompleteLogicReturn, ValidationState, UseAutocompleteLogicProps } from './types';
import { getUserDisplayName } from './utils';

export function useAutocompleteLogic({
  value,
  onChange,
  onSubmit,
}: UseAutocompleteLogicProps): AutocompleteLogicReturn {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { users } = useUsersQuery();

  // Create optimized lookup maps - single O(n) pass instead of O(3n)
  const userMaps = useMemo(() => {
    const byId = new Map();
    const byDisplayName = new Map();
    const byEmail = new Map();
    
    users.forEach(user => {
      const displayName = getUserDisplayName(user);
      byId.set(user.id, user);
      byDisplayName.set(displayName.toLowerCase(), user);
      byEmail.set(user.email.toLowerCase(), user);
    });
    
    return { byId, byDisplayName, byEmail };
  }, [users]);

  // Find selected user - optimized Map lookup
  const selectedUser = useMemo(
    () => userMaps.byId.get(value) ?? undefined,
    [userMaps.byId, value]
  );

  // Find exact match for typed input - optimized Map lookup
  const exactMatch = useMemo(() => {
    if (!inputValue.trim() || selectedUser) return undefined;

    const searchTerm = inputValue.toLowerCase().trim();
    return userMaps.byDisplayName.get(searchTerm) || userMaps.byEmail.get(searchTerm) || undefined;
  }, [userMaps.byDisplayName, userMaps.byEmail, inputValue, selectedUser]);

  // Auto-select exact matches
  useEffect(() => {
    if (exactMatch && !selectedUser) {
      onChange(exactMatch.id);
      setInputValue('');
      // Keep focus on input after selection
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [exactMatch, selectedUser, onChange]);

  // Find the best matching suggestion for ghost text - optimized single pass
  const ghostSuggestion = useMemo(() => {
    if (!inputValue.trim() || selectedUser || exactMatch) return undefined;

    const searchTerm = inputValue.toLowerCase();
    // Single pass through users for prefix matching
    for (const user of users) {
      const displayName = getUserDisplayName(user);
      if (
        displayName.toLowerCase().startsWith(searchTerm) ||
        user.email.toLowerCase().startsWith(searchTerm)
      ) {
        return user;
      }
    }
    return undefined;
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
