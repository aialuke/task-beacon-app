
/**
 * Form Components - Standardized Export Organization
 * 
 * Centralized exports with consistent import patterns.
 */

// === EXTERNAL LIBRARIES ===
// (none required for exports)

// === MAIN FORM COMPONENTS ===
export { BaseTaskForm } from './BaseTaskForm';
export { QuickActionBar } from './QuickActionBar';

// === QUICK ACTION BAR COMPONENTS ===
export { DatePickerButton } from './components/DatePickerButton';
export { ActionButton } from './components/ActionButton';
export { SubmitButton } from './components/SubmitButton';

// === MODAL COMPONENTS ===
export { UrlInputModal } from './UrlInputModal';
export { UserSearchModal } from './UserSearchModal';

// === USER INPUT COMPONENTS ===
export { AutocompleteUserInput } from './AutocompleteUserInput';

// === PHOTO UPLOAD COMPONENTS ===
// Default exports for lazy loading compatibility
export { default as SimplePhotoUpload } from './SimplePhotoUpload';
export { default as SimplePhotoUploadModal } from './SimplePhotoUploadModal';

// Named exports for backward compatibility
export { SimplePhotoUpload as SimplePhotoUploadNamed } from './SimplePhotoUpload';
export { SimplePhotoUploadModal as SimplePhotoUploadModalNamed } from './SimplePhotoUploadModal';

// === REFERENCE COMPONENTS ===
export { ParentTaskReference } from './ParentTaskReference';
export { ReferenceCard } from './ReferenceCard';
