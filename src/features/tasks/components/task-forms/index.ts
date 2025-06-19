/**
 * Task Form Components - Barrel Export
 * 
 * Task-specific form components moved from shared component library
 * to maintain proper feature boundaries and reduce coupling.
 */

export { AutocompleteUserInput } from './AutocompleteUserInput';
export { ParentTaskReference } from './ParentTaskReference';
export { ReferenceCard } from './ReferenceCard';
export { UserSearchModal } from './UserSearchModal';

// Re-export autocomplete components
export * from './autocomplete';