/**
 * Autocomplete - Unified Entry Point
 *
 * Re-exports all autocomplete functionality for easy importing.
 * Provides a single import point for all autocomplete-related functionality.
 */

export type { AutocompleteUserInputProps } from './types';
export { useAutocompleteLogic } from './useAutocompleteLogic';
export { getBorderColor, shouldShowPlaceholder } from './utils';
export { AutocompleteUserTag } from './AutocompleteUserTag';
export { AutocompleteStatusIcon } from './AutocompleteStatusIcon';
