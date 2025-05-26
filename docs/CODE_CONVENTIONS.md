
# Code Patterns and Conventions

This document outlines the patterns and conventions used in the codebase to maintain consistency and improve maintainability.

## Naming Conventions

- **Components**: PascalCase (e.g., `TaskCard`, `CreateTaskForm`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTaskContext`, `useTaskMutations`)
- **Utility functions**: camelCase (e.g., `formatDate`, `truncateUrl`)
- **Constants**: UPPER_SNAKE_CASE for global constants, camelCase for component-level constants
- **Files**:
  - React components: PascalCase (e.g., `TaskCard.tsx`)
  - Hooks: camelCase (e.g., `useTaskMutations.ts`)
  - Utility files: camelCase (e.g., `dateUtils.ts`)
  - Context files: PascalCase with `Context` suffix (e.g., `TaskContext.tsx`)

## Component Structure and Organization

### Component Categories

1. **UI Components** (`components/ui/`): Base Shadcn UI components
2. **Layout Components** (`components/ui/layout/`): Layout-specific UI components
3. **Business Components** (`components/business/`): Shared business logic components
4. **Feature Components** (`features/*/components/`): Feature-specific components

### Functional Components Pattern

```tsx
// Import statements (standardized order)
import { memo, useCallback } from "react";
import { ComponentProps } from "./types";
import { Button } from "@/components/ui/button";
import { useFeatureHook } from "@/features/feature/hooks/useFeatureHook";

// Component definition
function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks (in order: context, queries, mutations, state, effects)
  const { data } = useFeatureHook();
  
  // Derived state
  const computedValue = useMemo(() => data?.value, [data]);
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// Export with memo for performance optimization when appropriate
export default memo(ComponentName);
```

## Custom Hooks Pattern

### Hook Organization

- **Mutation Hooks**: Centralized operations (e.g., `useTaskMutations`)
- **Query Hooks**: Data fetching (e.g., `useTaskQueries`)
- **UI Hooks**: Component state management (e.g., `useTaskCard`)
- **Validation Hooks**: Form validation (e.g., `useTaskFormValidation`)

### Hook Structure

```tsx
export function useCustomHook() {
  // External hooks and context
  const { contextValue } = useContext();
  
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Memoized values
  const memoizedValue = useMemo(() => computation, [dependencies]);
  
  // Callbacks
  const handleAction = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  // Return interface
  return {
    state,
    memoizedValue,
    handleAction,
  };
}
```

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

1. **Direct Imports (Preferred)**:
   ```typescript
   import { formatDate } from "@/lib/dateUtils";
   import { compressAndResizePhoto } from "@/lib/imageUtils";
   import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";
   ```

2. **Barrel Imports (Common utilities only)**:
   ```typescript
   import { cn, formatDate, truncateText } from "@/lib/utils";
   ```

3. **Feature Imports**:
   ```typescript
   import { TaskCard } from "@/features/tasks/components/TaskCard";
   import { useTaskContext } from "@/features/tasks/context/TaskContext";
   ```

## Form Handling Patterns

### Standardized Form Validation

All forms use the `useFormWithValidation` hook pattern:

```tsx
const form = useFormWithValidation({
  schema: validationSchema,
  defaultValues,
  onSubmit: handleSubmit,
  successMessage: "Success message"
});
```

### Form Component Structure

1. **Form Hook**: Handles state and validation
2. **Form Component**: Renders UI and handles user interaction
3. **Field Components**: Reusable form field components

## State Management Patterns

### Context Usage

- **Global State**: Authentication, theme, UI preferences
- **Feature State**: Feature-specific data and operations
- **Component State**: Local component state only

### Context Structure

```tsx
interface ContextValue {
  // State
  data: DataType;
  
  // Actions
  updateData: (data: DataType) => void;
  
  // Computed values
  isLoading: boolean;
}
```

## Performance Optimization

- **React.memo()**: For components that receive stable props
- **useMemo()**: For expensive calculations
- **useCallback()**: For event handlers and functions passed as props
- **Code splitting**: Lazy loading for routes and large components

## Error Handling

### Three-Layer Approach

1. **API Layer**: Standardized error format with `handleApiError`
2. **Hook Layer**: Try/catch with toast notifications
3. **UI Layer**: Error boundaries and fallback components

## Testing Conventions

- **Unit tests**: One test file per utility/hook
- **Component tests**: User interaction focused
- **Mocks**: External dependencies (Supabase, etc.)
- **Test IDs**: `data-testid` for component queries

## Animation and Styling

### CSS Class Organization

- **Tailwind utilities**: Primary styling approach
- **Component-specific styles**: In dedicated CSS files
- **Animation classes**: Defined in utilities/animations.css

### Animation Patterns

- **CSS transitions**: For simple state changes
- **React Spring**: For complex animations
- **Performance**: Use `transform` and `opacity` properties
