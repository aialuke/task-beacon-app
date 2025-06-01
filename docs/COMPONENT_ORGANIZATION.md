# Component Organization

This document outlines the component organization structure after refactoring to improve maintainability and developer experience.

## Directory Structure

```
src/
├── components/
│   ├── ui/                     # Shared UI components
│   │   ├── auth/              # Authentication UI components
│   │   │   ├── index.ts
│   │   │   ├── ModernAuthForm.tsx
│   │   │   ├── FloatingInput.tsx
│   │   │   └── PasswordStrengthIndicator.tsx
│   │   ├── form/              # General form UI components
│   │   │   ├── index.ts
│   │   │   ├── FloatingInput.tsx
│   │   │   ├── FloatingTextarea.tsx
│   │   │   ├── AnimatedCharacterCount.tsx
│   │   │   ├── useFormWithZod.ts
│   │   │   ├── useFormWithValidation.ts
│   │   │   └── useFormSubmission.ts
│   │   ├── layout/            # Layout components
│   │   │   ├── index.ts
│   │   │   └── LoadingSpinner.tsx
│   │   ├── index.ts           # Main UI exports
│   │   ├── button.tsx         # Core UI components
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx           # React Hook Form components
│   │   ├── sidebar.tsx
│   │   ├── simple-navbar.tsx
│   │   └── ... (other shadcn/ui components)
│   ├── form/                  # Feature-specific form components
│   │   ├── index.ts
│   │   ├── BaseTaskForm.tsx
│   │   ├── QuickActionBar.tsx
│   │   ├── UrlInputModal.tsx
│   │   ├── PhotoUploadField.tsx
│   │   └── ... (task-related forms)
│   ├── business/              # Business logic components
│   │   ├── index.ts
│   │   └── ErrorBoundary.tsx
│   └── providers/             # Context providers
│
├── features/
│   ├── tasks/
│   │   ├── components/        # Task-specific components
│   │   │   ├── index.ts
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── FabButton.tsx
│   │   │   ├── timer/         # Timer sub-components
│   │   │   │   ├── TimerDisplay.tsx
│   │   │   │   └── TimerRing.tsx
│   │   │   └── ... (other task components)
│   │   ├── hooks/             # Task-specific hooks
│   │   ├── context/           # Task contexts
│   │   └── utils/             # Task utilities
│   └── users/
│       ├── components/        # User-specific components
│       ├── hooks/
│       └── utils/
```

## Organization Principles

### 1. Shared UI Components (`src/components/ui/`)
- **Purpose**: Reusable components that can be used across different features
- **Examples**: Buttons, inputs, modals, navigation components
- **Subdirectories**:
  - `auth/`: Authentication-related UI components
  - `form/`: General-purpose form components and hooks
  - `layout/`: Layout and structural components

### 2. Feature-Specific Components (`src/features/*/components/`)
- **Purpose**: Components that are specific to a particular feature domain
- **Examples**: TaskCard, CountdownTimer, UserProfile
- **Benefits**: 
  - Clear ownership and responsibility
  - Easier to find and modify feature-specific logic
  - Better code organization for large features

### 3. Business Logic Components (`src/components/business/`)
- **Purpose**: Components that handle cross-cutting business concerns
- **Examples**: ErrorBoundary, global providers
- **Note**: This directory is minimal and focused on truly shared business logic

### 4. Feature-Specific Forms (`src/components/form/`)
- **Purpose**: Form components that are specific to task management features
- **Examples**: BaseTaskForm, QuickActionBar, PhotoUploadField
- **Rationale**: These are too specific to tasks to be in the general UI directory

## Import Patterns

### UI Components
```typescript
// Import from main UI index
import { Button, Input, Card } from '@/components/ui';

// Import specific form components
import { FloatingInput } from '@/components/ui/form';

// Import auth components
import { ModernAuthForm } from '@/components/ui/auth';
```

### Feature Components
```typescript
// Import from feature index
import { TaskCard, CountdownTimer } from '@/features/tasks/components';

// Import specific components
import TaskList from '@/features/tasks/components/TaskList';
```

### Task-Specific Forms
```typescript
// Import from form index
import { BaseTaskForm, QuickActionBar } from '@/components/form';
```

## Benefits of This Organization

### 1. **Clear Separation of Concerns**
- UI components are truly reusable and generic
- Feature components are co-located with related business logic
- Forms are organized by their purpose and complexity

### 2. **Improved Developer Experience**
- Consistent import patterns
- Easy to find components using the directory structure
- Centralized exports through index files

### 3. **Better Maintainability**
- Components are grouped by their responsibility
- Easier to refactor feature-specific code
- Clear boundaries between shared and feature-specific code

### 4. **Scalability**
- New features can follow the same pattern
- UI components can grow without cluttering feature directories
- Easy to extract features into separate packages if needed

## Migration Notes

### Moved Components
- **FloatingInput, FloatingTextarea**: `src/components/form/` → `src/components/ui/form/`
- **ModernAuthForm, PasswordStrengthIndicator**: `src/components/auth/` → `src/components/ui/auth/`
- **Form hooks**: `src/components/form/` → `src/components/ui/form/`

### Import Path Updates
- Update imports to use the new paths
- Use specific component imports to avoid conflicts with `form.tsx`
- Leverage index files for cleaner imports

### Cleanup
- Removed duplicate timer components
- Removed empty directories
- Updated business component exports

## Index Files

Each major directory includes an `index.ts` file that provides centralized exports:

- `src/components/ui/index.ts`: All shared UI components
- `src/components/ui/form/index.ts`: Form-specific UI components
- `src/components/ui/auth/index.ts`: Auth-specific UI components
- `src/components/form/index.ts`: Task-specific form components
- `src/features/tasks/components/index.ts`: Task-specific components

This organization provides a clear, scalable structure that separates concerns while maintaining excellent developer experience. 