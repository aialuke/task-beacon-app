/**
 * Autocomplete User Tag - User Display Tag Component
 *
 * Focused component for displaying selected users in autocomplete.
 * Handles user display and removal interaction.
 */

import { X } from 'lucide-react';

import type { User } from '@/types';

import { getUserDisplayName } from './utils';

interface AutocompleteUserTagProps {
  user: User;
  onClear: () => void;
  disabled?: boolean;
}

export function AutocompleteUserTag({
  user,
  onClear,
  disabled = false,
}: AutocompleteUserTagProps) {
  return (
    <div className="flex items-center bg-primary/10 px-2 py-1 text-sm text-primary">
      <span>{getUserDisplayName(user)}</span>
      <button
        type="button"
        className="ml-1 text-primary/70 hover:text-primary"
        onClick={onClear}
        disabled={disabled}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
