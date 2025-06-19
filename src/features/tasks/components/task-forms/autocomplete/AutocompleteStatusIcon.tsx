/**
 * Autocomplete Status Icon - Status Indicator Component
 *
 * Focused component for displaying validation status icons.
 * Provides visual feedback for autocomplete state.
 */

import { User as UserIcon } from 'lucide-react';

import type { User } from '@/types';

import type { ValidationState } from './types';

interface AutocompleteStatusIconProps {
  selectedUser: User | undefined;
  validationState: ValidationState;
}

export function AutocompleteStatusIcon({
  selectedUser,
  validationState,
}: AutocompleteStatusIconProps) {
  if (selectedUser) {
    return <UserIcon className="size-4 text-green-500" />;
  }

  switch (validationState) {
    case 'invalid':
      return <UserIcon className="size-4 text-red-500" />;
    default:
      return <UserIcon className="size-4 text-muted-foreground" />;
  }
}
