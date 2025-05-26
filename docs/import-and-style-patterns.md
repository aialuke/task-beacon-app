
# Import Patterns and Styling Guidelines

This document covers import organization, styling patterns, and file structure guidelines.

## Import Order and Patterns

### Standardized Import Order

1. React and React-related imports
2. Third-party libraries  
3. UI components (from `@/components/ui`)
4. Business components (from `@/components/business`)
5. Feature components
6. Hooks (context, queries, mutations, custom)
7. Utilities (direct imports preferred)
8. Types and interfaces
9. Assets and styles

### Import Pattern Standards

#### 1. Direct Imports (Preferred)
```typescript
import { formatDate } from "@/lib/dateUtils";
import { compressAndResizePhoto } from "@/lib/imageUtils";
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";
```

#### 2. Feature Imports
```typescript
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
```

#### 3. Type Imports
```typescript
import { Task, TaskStatus, TaskFilter } from "@/types";
import { ApiResponse, ApiError } from "@/types";
```

## Context Boundaries

### Strict Context Separation

- **Data Context**: Task queries, mutations, and data operations
- **UI Context**: Filters, expanded state, mobile detection  
- **Auth Context**: User authentication and session management

### Context Usage Guidelines

```tsx
// Correct: Use specific context hooks
const { tasks, isLoading } = useTaskContext();
const { filter, setFilter } = useTaskUIContext();

// Avoid: Mixed concerns in single context
```

## Hook Organization

### Hook Categories

- **State Hooks**: `useTaskFormState` - Basic state management
- **Composition Hooks**: `useTaskForm` - Combines multiple concerns
- **Validation Hooks**: `useTaskFormValidation` - Validation logic
- **Mutation Hooks**: `useCreateTask` - Data operations

### Hook Composition Pattern

```tsx
export function useComplexForm() {
  const state = useFormState();
  const validation = useFormValidation();
  const upload = usePhotoUpload();
  
  return {
    ...state,
    ...validation,
    ...upload,
  };
}
```

## Animation and Styling

### CSS Class Organization

- **Tailwind utilities**: Primary styling approach
- **Component-specific styles**: In dedicated CSS files
- **Animation classes**: Defined in utilities/animations.css

### Animation Patterns

- **CSS transitions**: For simple state changes
- **React Spring**: For complex animations
- **Performance**: Use `transform` and `opacity` properties

## File Organization

- **Small files**: Prefer multiple small files over large ones
- **Single responsibility**: One main export per file
- **Clear naming**: File names should match their primary export
- **Feature grouping**: Group related files in feature directories
